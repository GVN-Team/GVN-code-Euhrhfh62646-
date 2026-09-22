/* =========================================================
   The._.Sigh - メインロジック (main.js)
   ※ このファイルより先に config.js を読み込んでください。
   ========================================================= */

/* ---------------------------------------------------------
   Firebase クラウド同期(モジュール読み込みを動的importに変換)
   ※元のファイルと同じく window.doc / setDoc / getDoc は公開して
     いません(元コードのままの挙動を維持しています)。
--------------------------------------------------------- */
(async function initFirebaseSync() {
    const appId = typeof __app_id !== 'undefined' ? __app_id : window.APP_UNIQUE_ID;
    let db = null;
    let auth = null;
    let authUser = null;

    if (typeof __firebase_config !== 'undefined' && __firebase_config) {
        try {
            const { initializeApp } = await import('https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js');
            const { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged } = await import('https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js');
            const { getFirestore } = await import('https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js');

            const firebaseConfig = JSON.parse(__firebase_config);
            const app = initializeApp(firebaseConfig);
            auth = getAuth(app);
            db = getFirestore(app);

            const initAuth = async () => {
                try {
                    if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                        await signInWithCustomToken(auth, __initial_auth_token);
                    } else {
                        await signInAnonymously(auth);
                    }
                } catch (err) {}
            };
            initAuth();

            onAuthStateChanged(auth, (user) => {
                authUser = user;
                if (user && window.currentUser) {
                    if (typeof syncUserDataFromCloud === 'function') syncUserDataFromCloud();
                }
            });
        } catch (e) {}
    }

    window.db = db;
    window.getAuthUser = () => authUser;
    window.appId = appId;
})();

/* ---------------------------------------------------------
   アプリ本体のロジック
--------------------------------------------------------- */
        const STORAGE_PREFIX = window.APP_UNIQUE_ID + "_";

        function getStoredData(key, defaultVal) {
            try {
                const item = localStorage.getItem(STORAGE_PREFIX + key);
                return item ? JSON.parse(item) : defaultVal;
            } catch (e) {
                return defaultVal;
            }
        }
        function setStoredData(key, val) {
            try {
                localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(val));
            } catch (e) {}
        }

        const notificationSettings = getStoredData('notifications_config', {
            playbackRate: true,
            share: true,
            watchLater: true,
            historyClear: true,
            resume: true,
            system: true
        });

        const appConfig = {
            playbackRate: 1.0,
            autoPlay: true
        };

        let searchQuery = "";
        let currentSortOrder = "newest";
        let isTheaterMode = false;
        let pendingResumeTime = 0;
        let controlsTimeout = null;

        function updateNotificationCategory(category, value) {
            notificationSettings[category] = value;
            setStoredData('notifications_config', notificationSettings);
        }

        function filterNotificationItems() {
            const input = document.getElementById('notifSearchInput');
            const clearBtn = document.getElementById('notifSearchClearBtn');
            const query = input.value.trim().toLowerCase();
            const items = document.querySelectorAll('.notif-item');
            let matchCount = 0;

            if (query.length > 0) {
                clearBtn.classList.remove('hidden');
            } else {
                clearBtn.classList.add('hidden');
            }

            items.forEach(item => {
                const title = item.getAttribute('data-title') ? item.getAttribute('data-title').toLowerCase() : '';
                const desc = item.getAttribute('data-desc') ? item.getAttribute('data-desc').toLowerCase() : '';
                
                if (title.includes(query) || desc.includes(query)) {
                    item.classList.remove('hidden');
                    item.classList.add('flex');
                    matchCount++;
                } else {
                    item.classList.add('hidden');
                    item.classList.remove('flex');
                }
            });

            const noMatchMsg = document.getElementById('noNotifMatchMsg');
            if (matchCount === 0) {
                noMatchMsg.classList.remove('hidden');
            } else {
                noMatchMsg.classList.add('hidden');
            }
        }

        function clearNotifSearch() {
            const input = document.getElementById('notifSearchInput');
            input.value = '';
            filterNotificationItems();
        }

        function setAllNotifications(enable) {
            const categories = ['playbackRate', 'share', 'watchLater', 'historyClear', 'resume', 'system'];
            categories.forEach(cat => {
                notificationSettings[cat] = enable;
                const checkbox = document.getElementById(`notif-${cat}`);
                if (checkbox) checkbox.checked = enable;
            });
            setStoredData('notifications_config', notificationSettings);
            showToast(enable ? "すべての通知をONにしました" : "すべての通知をOFFにしました", "system");
        }

        function openNotificationSettingsModal() {
            const categories = ['playbackRate', 'share', 'watchLater', 'historyClear', 'resume', 'system'];
            categories.forEach(cat => {
                const checkbox = document.getElementById(`notif-${cat}`);
                if (checkbox) checkbox.checked = !!notificationSettings[cat];
            });
            clearNotifSearch();
            document.getElementById('notificationSettingsModal').classList.remove('hidden');
        }

        function closeNotificationSettingsModal() {
            document.getElementById('notificationSettingsModal').classList.add('hidden');
        }

        function updateAppConfig(key, value) {
            appConfig[key] = value;
            if (key === 'playbackRate' && player) {
                player.playbackRate = value;
                showToast(`再生速度を ${value}x に変更しました`, 'playbackRate');
            }
        }

        let currentUser = null;
        let currentUserAvatar = "";
        let userWatchHistory = [];
        let userWatchLater = [];
        let userResumeTimes = {};

        function displayLoginError(msgHTML) {
            const errBox = document.getElementById('loginError');
            const errText = document.getElementById('loginErrorMsg');
            const btnArea = document.getElementById('loginBtnContainer');
            const loadArea = document.getElementById('loadingArea');

            loadArea.classList.add('hidden');
            loadArea.classList.remove('flex');
            btnArea.classList.remove('hidden');

            errText.innerHTML = msgHTML;
            errBox.classList.remove('hidden');
            errBox.classList.add('flex');
            lucide.createIcons();
        }

        function loginWithDiscord() {
            window.location.href = DISCORD_CONFIG["verify-url"];
        }

        async function handleDiscordCallback() {
            const urlParams = new URLSearchParams(window.location.search);
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            
            const code = urlParams.get('code');
            const accessToken = hashParams.get('access_token') || urlParams.get('access_token');

            if (!code && !accessToken) return;

            const errBox = document.getElementById('loginError');
            const btnArea = document.getElementById('loginBtnContainer');
            const loadArea = document.getElementById('loadingArea');
            const loadTextContainer = document.getElementById('loadingTextContainer');

            errBox.classList.add('hidden');
            btnArea.classList.add('hidden');
            loadArea.classList.remove('hidden');
            loadArea.classList.add('flex');
            
            // Discordログイン時：文字を表示せずグルグル（スピナー）のみにする
            if (loadTextContainer) {
                loadTextContainer.classList.add('hidden');
            }

            window.history.replaceState({}, document.title, window.location.pathname);

            try {
                let token = accessToken;
                
                if (!token) {
                    displayLoginError('Discord認証に失敗しました');
                    return;
                }

                // ユーザー情報とGuild Member情報を取得
                const userRes = await fetch('https://discord.com/api/v10/users/@me', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!userRes.ok) {
                    throw new Error('AUTH_FAILED');
                }

                const userData = await userRes.json();
                
                // DiscordアイコンのURL生成
                let avatarUrl = "";
                if (userData.avatar) {
                    avatarUrl = `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`;
                } else if (userData.id) {
                    const defaultIndex = Number(BigInt(userData.id) % 5n);
                    avatarUrl = `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png`;
                }

                const guildMemberRes = await fetch(`https://discord.com/api/v10/users/@me/guilds/${DISCORD_CONFIG["server-id"]}/member`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!guildMemberRes.ok) {
                    displayLoginError(`ロールを所持していません<br><a href="${DISCORD_CONFIG["invite-url"]}" target="_blank" class="underline font-bold text-amber-400">${DISCORD_CONFIG["invite-url"]}</a> でロールを購入してください`);
                    return;
                }

                const memberData = await guildMemberRes.json();
                const hasRole = memberData.roles && memberData.roles.some(role => String(role) === String(DISCORD_CONFIG["role-id"]));

                if (hasRole) {
                    const discordUsername = userData.global_name || userData.username || "DiscordUser";
                    setStoredData('session_user', discordUsername);
                    setStoredData('session_avatar', avatarUrl);
                    applyLoginState(discordUsername, avatarUrl);
                } else {
                    displayLoginError(`ロールを所持していません<br><a href="${DISCORD_CONFIG["invite-url"]}" target="_blank" class="underline font-bold text-amber-400">${DISCORD_CONFIG["invite-url"]}</a> でロールを購入してください`);
                }
            } catch (err) {
                displayLoginError('Discord認証に失敗しました');
            }
        }

        window.onload = function() {
            lucide.createIcons();
            
            handleDiscordCallback();

            const savedUser = getStoredData('session_user', null);
            const savedAvatar = getStoredData('session_avatar', null);
            if (savedUser) {
                applyLoginState(savedUser, savedAvatar);
            }
            setupKeyboardShortcuts();
            setupDoubleTapGestures();
            setupAutoFadeControls();
            setupImageSwipeEvents();
        };

        const loaderMessages = [
            "サーバーとのセキュア接続を確立中",
            "データベースからユーザー情報を取得中",
            "資格情報とハッシュキーを照合中",
            "アクセス権限を検証しています",
            "暗号化されたセッションを初期化中"
        ];
        let dotInterval;

        function startDots() {
            let count = 0;
            const dotsEl = document.getElementById('loadingDots');
            dotInterval = setInterval(() => {
                count = (count % 3) + 1;
                dotsEl.textContent = ".".repeat(count);
            }, 100);
        }

        async function handleLogin(event) {
            event.preventDefault();
            const userInp = document.getElementById('userId');
            const passInp = document.getElementById('userPwd');
            const btnArea = document.getElementById('loginBtnContainer');
            const loadArea = document.getElementById('loadingArea');
            const loadTextContainer = document.getElementById('loadingTextContainer');
            const loadMsg = document.getElementById('loadingMsg');

            document.getElementById('loginError').classList.add('hidden');
            btnArea.classList.add('hidden');
            
            // 通常ログイン時：文字テキストを表示してステップ実行
            if (loadTextContainer) {
                loadTextContainer.classList.remove('hidden');
            }
            loadArea.classList.remove('hidden');
            loadArea.classList.add('flex');

            startDots();
            
            const steps = 3; 
            for (let i = 0; i < steps; i++) {
                loadMsg.textContent = loaderMessages[Math.floor(Math.random() * loaderMessages.length)];
                await new Promise(r => setTimeout(r, 400));
            }

            let targetDB = dummyLocalDB;
            try {
                const remoteRes = await fetch("https://github.com/Minecraft-jp/------/raw/refs/heads/main/-", { mode: 'cors' });
                if (remoteRes.ok) {
                    const remoteData = await remoteRes.json();
                    if (Array.isArray(remoteData)) targetDB = remoteData;
                }
            } catch (e) {
                targetDB = dummyLocalDB;
            }

            clearInterval(dotInterval);

            const foundUser = targetDB.find(u => u.username === userInp.value && u.password === passInp.value);

            if (foundUser) {
                setStoredData('session_user', foundUser.username);
                setStoredData('session_avatar', "");
                applyLoginState(foundUser.username, "");
            } else {
                userInp.value = ""; passInp.value = "";
                displayLoginError('認証に失敗しました');
            }
        }

        function applyLoginState(username, avatarUrl) {
            currentUser = username;
            currentUserAvatar = avatarUrl || getStoredData('session_avatar', '');
            
            userWatchHistory = getStoredData('history_' + currentUser, []);
            userWatchLater = getStoredData('watchlater_' + currentUser, []);
            userResumeTimes = getStoredData('resumes_' + currentUser, {});

            window.currentUser = currentUser;
            
            if (window.db && window.getAuthUser && window.getAuthUser()) {
                syncUserDataFromCloud(); 
            }

            document.getElementById('headerUsername').textContent = username;
            
            // 右上アイコンをDiscord認証のアイコンに設定（存在しない場合は標準アイコン）
            const userMenuBtn = document.getElementById('userMenuBtn');
            if (currentUserAvatar) {
                userMenuBtn.innerHTML = `<img src="${currentUserAvatar}" alt="${username}" class="w-full h-full object-cover rounded-full">`;
            } else {
                userMenuBtn.innerHTML = `<i data-lucide="user" class="w-5 h-5 sm:w-6 sm:h-6 pointer-events-none"></i>`;
                lucide.createIcons();
            }

            document.getElementById('loginScreen').classList.add('hidden');
            document.getElementById('loginScreen').classList.remove('flex');
            const mainContent = document.getElementById('mainContent');
            mainContent.classList.remove('hidden');
            mainContent.classList.add('flex');
            initPlayer();
        }

        async function syncUserDataFromCloud() {
            if (!currentUser) return;
            const authUser = window.getAuthUser ? window.getAuthUser() : null;
            if (!window.db || !authUser) return;

            try {
                const docRef = window.doc(window.db, 'artifacts', window.appId, 'users', authUser.uid, 'userData', currentUser);
                const docSnap = await window.getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (Array.isArray(data.history)) userWatchHistory = data.history;
                    if (Array.isArray(data.watchLater)) userWatchLater = data.watchLater;
                    if (data.resumeTimes) userResumeTimes = data.resumeTimes;
                    
                    setStoredData('history_' + currentUser, userWatchHistory);
                    setStoredData('watchlater_' + currentUser, userWatchLater);
                    setStoredData('resumes_' + currentUser, userResumeTimes);

                    updateWatchLaterBtnUI();
                    renderPlaylist();
                } else {
                    saveUserDataToCloud();
                }
            } catch (err) {}
        }

        async function saveUserDataToCloud() {
            if (!currentUser) return;
            setStoredData('history_' + currentUser, userWatchHistory);
            setStoredData('watchlater_' + currentUser, userWatchLater);
            setStoredData('resumes_' + currentUser, userResumeTimes);

            const authUser = window.getAuthUser ? window.getAuthUser() : null;
            if (!window.db || !authUser) return;

            try {
                const docRef = window.doc(window.db, 'artifacts', window.appId, 'users', authUser.uid, 'userData', currentUser);
                await window.setDoc(docRef, {
                    username: currentUser,
                    history: userWatchHistory,
                    watchLater: userWatchLater,
                    resumeTimes: userResumeTimes,
                    updatedAt: new Date().toISOString()
                }, { merge: true });
            } catch (err) {}
        }

        function toggleUserMenu(e) {
            if (e) e.stopPropagation();
            const menu = document.getElementById('userMenuDropdown');
            menu.classList.toggle('hidden');
        }

        function closeUserMenu() {
            const menu = document.getElementById('userMenuDropdown');
            if (menu) menu.classList.add('hidden');
        }

        function logout() {
            try {
                localStorage.removeItem(STORAGE_PREFIX + 'session_user');
                localStorage.removeItem(STORAGE_PREFIX + 'session_avatar');
            } catch (e) {}

            currentUser = null;
            currentUserAvatar = "";
            window.currentUser = null;
            userWatchHistory = [];
            userWatchLater = [];
            userResumeTimes = {};

            closeUserMenu();
            if (player) {
                player.pause();
                player.src = "";
            }
            
            const userMenuBtn = document.getElementById('userMenuBtn');
            if (userMenuBtn) {
                userMenuBtn.innerHTML = `<i data-lucide="user" class="w-5 h-5 sm:w-6 sm:h-6 pointer-events-none"></i>`;
                lucide.createIcons();
            }

            document.getElementById('mainContent').classList.add('hidden');
            document.getElementById('mainContent').classList.remove('flex');
            document.getElementById('loginScreen').classList.remove('hidden');
            document.getElementById('loginScreen').classList.add('flex');
            
            document.getElementById('userId').value = "";
            document.getElementById('userPwd').value = "";
            document.getElementById('loadingArea').classList.add('hidden');
            document.getElementById('loginBtnContainer').classList.remove('hidden');
            document.getElementById('loginError').classList.add('hidden');
            
            showToast("ログアウトしました", "system");
        }

        document.addEventListener('click', (e) => {
            const userMenu = document.getElementById('userMenuDropdown');
            const userBtn = document.getElementById('userMenuBtn');
            if (userMenu && !userMenu.classList.contains('hidden')) {
                if (!userMenu.contains(e.target) && !userBtn.contains(e.target)) {
                    userMenu.classList.add('hidden');
                }
            }

            const sortDropdown = document.getElementById('sortDropdown');
            const sortBtn = document.getElementById('sortBtn');
            if (sortDropdown && !sortDropdown.classList.contains('hidden')) {
                if (!sortDropdown.contains(e.target) && !sortBtn.contains(e.target)) {
                    sortDropdown.classList.add('hidden');
                }
            }
        });

        function recordHistory(videoId) {
            if (!currentUser) return;
            const now = new Date();
            const timeString = `${now.getMonth()+1}/${now.getDate()} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
            userWatchHistory = userWatchHistory.filter(item => item.id !== videoId);
            userWatchHistory.unshift({ id: videoId, watchedAt: timeString });
            saveUserDataToCloud();
        }

        function openHistoryModal() {
            const container = document.getElementById('historyListContainer');
            container.innerHTML = "";
            if (userWatchHistory.length === 0) {
                container.innerHTML = `<p class="text-xs text-brandMuted text-center py-8">視聴履歴はありません</p>`;
            } else {
                userWatchHistory.forEach(item => {
                    const v = videos.find(video => video.id === item.id);
                    if (!v) return;
                    const el = document.createElement('div');
                    el.className = "flex items-center justify-between p-3 bg-brandBg rounded-xl border border-brandBorder cursor-pointer hover:border-brandAccent transition-all";
                    el.onclick = () => {
                        loadMedia(v.id);
                        closeHistoryModal();
                    };
                    el.innerHTML = `
                        <div class="flex items-center gap-3 min-w-0">
                            <img src="${v.thumbnail}" class="w-16 h-10 object-contain bg-black rounded border border-brandBorder flex-shrink-0">
                            <div class="min-w-0">
                                <p class="text-xs font-bold text-brandText truncate">${v.title}</p>
                                <p class="text-[10px] text-brandMuted">${item.watchedAt}</p>
                            </div>
                        </div>
                        <i data-lucide="play-circle" class="w-5 h-5 text-brandAccent flex-shrink-0 ml-2"></i>
                    `;
                    container.appendChild(el);
                });
            }
            document.getElementById('historyModal').classList.remove('hidden');
            lucide.createIcons();
        }

        function closeHistoryModal() {
            document.getElementById('historyModal').classList.add('hidden');
        }

        function clearHistory() {
            if (!currentUser) return;
            userWatchHistory = [];
            saveUserDataToCloud();
            openHistoryModal();
            showToast("視聴履歴を消去しました", "historyClear");
        }

        function toggleWatchLater() {
            if (!currentUser) return;
            const index = userWatchLater.indexOf(activeId);
            if (index >= 0) {
                userWatchLater.splice(index, 1);
                showToast("「あとで見る」から削除しました", "watchLater");
            } else {
                userWatchLater.push(activeId);
                showToast("「あとで見る」に追加しました", "watchLater");
            }
            saveUserDataToCloud();
            updateWatchLaterBtnUI();
        }

        function updateWatchLaterBtnUI() {
            const isAdded = userWatchLater.includes(activeId);
            const btn = document.getElementById('watchLaterBtn');
            if (isAdded) {
                btn.innerHTML = `<i data-lucide="bookmark" class="w-5 h-5 text-amber-400 fill-amber-400"></i>`;
            } else {
                btn.innerHTML = `<i data-lucide="bookmark" class="w-5 h-5 text-amber-400 fill-transparent"></i>`;
            }
            lucide.createIcons();
        }

        function openWatchLaterModal() {
            const container = document.getElementById('watchLaterListContainer');
            container.innerHTML = "";
            if (userWatchLater.length === 0) {
                container.innerHTML = `<p class="text-xs text-brandMuted text-center py-8">「あとで見る」リストは空です</p>`;
            } else {
                userWatchLater.forEach(id => {
                    const v = videos.find(video => video.id === id);
                    if (!v) return;
                    const el = document.createElement('div');
                    el.className = "flex items-center justify-between p-3 bg-brandBg rounded-xl border border-brandBorder";
                    el.innerHTML = `
                        <div class="flex items-center gap-3 min-w-0 cursor-pointer flex-grow" onclick="loadMedia(${v.id}); closeWatchLaterModal();">
                            <img src="${v.thumbnail}" class="w-16 h-10 object-contain bg-black rounded border border-brandBorder flex-shrink-0">
                            <div class="min-w-0">
                                <p class="text-xs font-bold text-brandText truncate">${v.title}</p>
                                <p class="text-[10px] text-brandMuted">${v.duration}</p>
                            </div>
                        </div>
                        <button onclick="removeFromWatchLater(${v.id}, event)" class="p-2 text-brandMuted hover:text-red-500 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center" title="削除">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    `;
                    container.appendChild(el);
                });
            }
            document.getElementById('watchLaterModal').classList.remove('hidden');
            lucide.createIcons();
        }

        function removeFromWatchLater(id, e) {
            if (e) e.stopPropagation();
            if (!currentUser) return;
            const index = userWatchLater.indexOf(id);
            if (index >= 0) {
                userWatchLater.splice(index, 1);
                saveUserDataToCloud();
                openWatchLaterModal();
                updateWatchLaterBtnUI();
                showToast("リストから削除しました", "watchLater");
            }
        }

        function closeWatchLaterModal() {
            document.getElementById('watchLaterModal').classList.add('hidden');
        }

        function showShortcutsModal() {
            document.getElementById('shortcutsModal').classList.remove('hidden');
        }
        function closeShortcutsModal() {
            document.getElementById('shortcutsModal').classList.add('hidden');
        }

        function openSettings() {
            const modal = document.getElementById('settingsModal');
            const content = document.getElementById('settingsModalContent');
            modal.classList.remove('hidden');
            setTimeout(() => {
                modal.classList.remove('opacity-0');
                content.classList.remove('scale-95'); content.classList.add('scale-100');
            }, 10);
        }
        function closeSettings() {
            const modal = document.getElementById('settingsModal');
            const content = document.getElementById('settingsModalContent');
            modal.classList.add('opacity-0');
            content.classList.remove('scale-100'); content.classList.add('scale-95');
            setTimeout(() => modal.classList.add('hidden'), 300);
        }

        function renderExternalLinks() {
            const container = document.getElementById("linksList");
            container.innerHTML = "";
            const sortedLinks = [...externalLinks].sort((a, b) => a.no - b.no);

            sortedLinks.forEach((link) => {
                const linkEl = document.createElement("a");
                linkEl.href = link.url;
                linkEl.target = "_blank";
                linkEl.title = `${link.title}へ移動`;
                linkEl.className = "orbit-btn-wrapper flex-shrink-0 active:scale-95 transition-all cursor-pointer";

                if (link.borderColor) {
                    linkEl.style.setProperty('--btn-border-color', link.borderColor);
                }

                let textColorClass = "text-white"; 
                if (link.color) {
                    textColorClass = link.color.startsWith('text-') ? link.color : `text-${link.color}`;
                }

                let iconHtml = "";
                if (link.icon && link.icon.trim() !== "") {
                    iconHtml = `<i data-lucide="${link.icon}" class="w-3.5 h-3.5 ${textColorClass}"></i>`;
                }

                linkEl.innerHTML = `
                    <div class="orbit-btn-inner px-4 py-2 flex items-center gap-1.5">
                        ${iconHtml}
                        <span class="tracking-widest ${textColorClass} text-xs font-black select-none">${link.title}</span>
                    </div>
                `;
                container.appendChild(linkEl);
            });
            lucide.createIcons();
        }

        // config.js で定義されたデータを使用
        const videos = videosData;

        let activeId = 1;
        const player = document.getElementById("mainPlayer");
        const playerSrc = document.getElementById("playerSource");
        const vTitle = document.getElementById("videoTitle");
        const vDate = document.getElementById("videoDate");
        const vDesc = document.getElementById("videoDesc");
        const playBtn = document.getElementById("playBtn");
        const muteBtn = document.getElementById("muteBtn");
        const seekBar = document.getElementById("seekBar");
        const volumeBar = document.getElementById("volumeBar");
        const volumeLevelText = document.getElementById("volumeLevel");
        const durationText = document.getElementById("duration");
        const currentTimeText = document.getElementById("currentTime");
        const fullscreenBtn = document.getElementById("fullscreenBtn");
        const playlistContainer = document.getElementById("playlist");
        const videoSpinner = document.getElementById("videoSpinner");

        function initPlayer() {
            const params = new URLSearchParams(window.location.search);
            const vParam = parseInt(params.get('v'));
            if (vParam && videos.find(v => v.id === vParam)) { activeId = vParam; } else { activeId = 1; }
            
            const originalAutoPlay = appConfig.autoPlay;
            appConfig.autoPlay = false; 
            loadMedia(activeId); 
            appConfig.autoPlay = originalAutoPlay;
            
            renderPlaylist();
            renderExternalLinks(); 
            lucide.createIcons();
            setupPlayerEventListeners();
            updateVolumeBarUI(100);
            
            player.playbackRate = appConfig.playbackRate;
        }

        function formatHashtags(text) {
            if (!text) return "";
            let escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
            const lines = escaped.split('\n');
            return lines.map(line => {
                if (/[#＃]/.test(line)) {
                    const matchedTags = line.match(/([#＃][^\s#＃]+)/g);
                    if (matchedTags) return `<span class="hashtag-container-gradient cursor-pointer" onclick="filterByTagText('${matchedTags[0].replace(/[#＃]/g,'')}')">${matchedTags.join(' ')}</span>`;
                }
                return line;
            }).join('<br>');
        }

        function filterByTagText(tagText) {
            const input = document.getElementById("searchInput");
            input.value = tagText;
            handleSearch();
        }

        function loadMedia(id) {
            const v = videos.find(item => item.id === id);
            if (!v) return;
            activeId = id;
            
            vTitle.textContent = v.title;
            vDate.textContent = `公開日: ${v.date}`;
            vDesc.innerHTML = formatHashtags(v.desc);
            renderPlaylist();
            updateWatchLaterBtnUI();
            recordHistory(v.id);

            const imageViewer = document.getElementById('imageViewer');
            const controls = document.getElementById('playerControls');
            const touchOverlay = document.getElementById('touchGestureOverlay');

            if (v.type === 'image' || v.images) {
                if (player) player.pause();
                player.classList.add('hidden');
                controls.classList.add('hidden');
                touchOverlay.classList.add('hidden');
                
                imageViewer.classList.remove('hidden');
                imageViewer.classList.add('flex');
                
                setupImageViewer(v.images);
            } else {
                imageViewer.classList.add('hidden');
                imageViewer.classList.remove('flex');
                
                player.classList.remove('hidden');
                controls.classList.remove('hidden');
                touchOverlay.classList.remove('hidden');

                playerSrc.src = v.url;
                player.poster = v.thumbnail;
                player.load();
                
                player.playbackRate = appConfig.playbackRate;
                videoSpinner.classList.remove("hidden");
                updateSeekBarUI(0);

                const savedTime = userResumeTimes[v.id] || 0;
                if (savedTime > 5) {
                    pendingResumeTime = savedTime;
                    document.getElementById('resumeTimeText').textContent = `再生位置: ${formatTime(savedTime)}`;
                    document.getElementById('resumeModal').classList.remove('hidden');
                } else {
                    startVideoPlayback();
                }
            }
        }

        let currentImageIndex = 0;
        let currentImages = [];

        function setupImageViewer(images) {
            currentImages = images;
            currentImageIndex = 0;
            
            const track = document.getElementById('imageTrack');
            const indicators = document.getElementById('imageIndicators');
            document.getElementById('totalImgNum').textContent = images.length;
            
            track.innerHTML = '';
            indicators.innerHTML = '';
            
            images.forEach((src, idx) => {
                const img = document.createElement('img');
                img.src = src;
                img.className = 'w-full h-full object-contain flex-shrink-0 select-none';
                img.ondragstart = () => false;
                track.appendChild(img);
                
                const dot = document.createElement('div');
                dot.className = `h-2 rounded-full transition-all duration-300 ${idx === 0 ? 'bg-brandAccent w-4' : 'bg-white/50 w-2'}`;
                indicators.appendChild(dot);
            });
            
            updateImageViewer();
        }

        function updateImageViewer() {
            const track = document.getElementById('imageTrack');
            track.style.transform = `translateX(-${currentImageIndex * 100}%)`;
            
            document.getElementById('currentImgNum').textContent = currentImageIndex + 1;
            
            const dots = document.getElementById('imageIndicators').children;
            for (let i = 0; i < dots.length; i++) {
                if (i === currentImageIndex) {
                    dots[i].className = 'h-2 rounded-full bg-brandAccent transition-all duration-300 w-4';
                } else {
                    dots[i].className = 'h-2 rounded-full bg-white/50 transition-all duration-300 w-2';
                }
            }
            
            document.getElementById('prevImgBtn').disabled = currentImageIndex === 0;
            document.getElementById('nextImgBtn').disabled = currentImageIndex === currentImages.length - 1;
        }

        function prevImage(e) {
            if(e) e.stopPropagation();
            if (currentImageIndex > 0) {
                currentImageIndex--;
                updateImageViewer();
            }
        }
        
        function nextImage(e) {
            if(e) e.stopPropagation();
            if (currentImageIndex < currentImages.length - 1) {
                currentImageIndex++;
                updateImageViewer();
            }
        }

        let touchStartX = 0;
        let touchEndX = 0;
        
        function setupImageSwipeEvents() {
            const viewer = document.getElementById('imageViewer');
            viewer.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, {passive: true});
            
            viewer.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            });
        }
        
        function handleSwipe() {
            const diffX = touchStartX - touchEndX;
            const threshold = 40; 
            
            if (diffX > threshold) {
                nextImage();
            } else if (diffX < -threshold) {
                prevImage();
            }
        }

        function confirmResume(shouldResume) {
            document.getElementById('resumeModal').classList.add('hidden');
            if (shouldResume && pendingResumeTime > 0) {
                player.currentTime = pendingResumeTime;
                showToast(`続きから再生 (${formatTime(pendingResumeTime)})`, 'resume');
            } else {
                player.currentTime = 0;
            }
            startVideoPlayback();
        }

        function startVideoPlayback() {
            if (appConfig.autoPlay) {
                player.play().then(() => {
                    playBtn.innerHTML = `<i data-lucide="pause" class="w-6 h-6 fill-current"></i>`;
                    lucide.createIcons();
                }).catch((err) => {
                    playBtn.innerHTML = `<i data-lucide="play" class="w-6 h-6 fill-current"></i>`;
                    lucide.createIcons();
                });
            } else {
                playBtn.innerHTML = `<i data-lucide="play" class="w-6 h-6 fill-current"></i>`;
                lucide.createIcons();
                player.addEventListener('canplay', () => videoSpinner.classList.add("hidden"), {once:true});
            }
            resetControlsTimeout();
        }

        function skipTime(seconds) {
            if (!player || isNaN(player.duration)) return;
            player.currentTime = Math.min(Math.max(player.currentTime + seconds, 0), player.duration);
            resetControlsTimeout();
        }

        function togglePlay() {
            if (player.paused) {
                player.play();
                playBtn.innerHTML = `<i data-lucide="pause" class="w-6 h-6 fill-current"></i>`;
            } else {
                player.pause();
                playBtn.innerHTML = `<i data-lucide="play" class="w-6 h-6 fill-current"></i>`;
            }
            lucide.createIcons();
            resetControlsTimeout();
        }

        function toggleTheaterMode() {
            isTheaterMode = !isTheaterMode;
            const grid = document.getElementById("mainLayoutGrid");
            const playerCol = document.getElementById("playerColumn");
            const theaterBtn = document.getElementById("theaterBtn");

            if (isTheaterMode) {
                grid.classList.remove("max-w-6xl");
                grid.classList.add("max-w-7xl");
                playerCol.classList.remove("lg:col-span-2");
                playerCol.classList.add("lg:col-span-3");
                
                theaterBtn.innerHTML = `<i data-lucide="rectangle-vertical" class="w-5 h-5 text-brandAccent"></i>`;
                showToast("大画面モード: ON", 'system');
            } else {
                grid.classList.remove("max-w-7xl");
                grid.classList.add("max-w-6xl");
                playerCol.classList.remove("lg:col-span-3");
                playerCol.classList.add("lg:col-span-2");
                
                theaterBtn.innerHTML = `<i data-lucide="rectangle-horizontal" class="w-5 h-5"></i>`;
                showToast("大画面モード: OFF", 'system');
            }
            lucide.createIcons();
        }

        function togglePiP() {
            if (document.pictureInPictureElement) {
                document.exitPictureInPicture().catch(() => {});
            } else if (player && document.pictureInPictureEnabled) {
                player.requestPictureInPicture().catch(() => {});
            }
        }

        async function shareVideo() {
            const finalShareUrl = SHARE_CONFIG.url;
            if (navigator.share) {
                try {
                    await navigator.share({ title: SHARE_CONFIG.title, text: SHARE_CONFIG.text, url: finalShareUrl });
                    showToast("共有メニューを開きました", 'share');
                } catch (error) {}
            } else {
                const temp = document.createElement("input"); temp.value = finalShareUrl; document.body.appendChild(temp); temp.select(); document.execCommand("copy"); document.body.removeChild(temp);
                showToast("リンクをコピーしました", 'share');
            }
        }

        async function downloadMedia() {
            const v = videos.find(item => item.id === activeId);
            if (!v) return;

            if (v.type === 'image' || v.images) {
                const imgUrl = currentImages[currentImageIndex];
                try {
                    const res = await fetch(imgUrl);
                    const blob = await res.blob();
                    const blobUrl = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = blobUrl; 
                    a.download = `image_${activeId}_${currentImageIndex + 1}.jpg`;
                    document.body.appendChild(a); a.click(); document.body.removeChild(a);
                    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
                    showToast("画像を保存しました", 'system');
                } catch(e) {
                    window.open(imgUrl, '_blank');
                }
            } else {
                const btn = document.getElementById("downloadBtn");
                const txt = document.getElementById("downloadBtnText");
                btn.disabled = true; txt.textContent = "準備中...";
                try {
                    const res = await fetch(v.url);
                    if (!res.ok) throw new Error();
                    const len = +res.headers.get('Content-Length');
                    const reader = res.body.getReader();
                    let rec = 0, chunks = [];
                    while(true) {
                        const {done, value} = await reader.read();
                        if (done) break;
                        chunks.push(value); rec += value.length;
                        if (len) txt.textContent = `${Math.round((rec / len) * 100)}%`;
                    }
                    const blob = new Blob(chunks, { type: "video/mp4" });
                    const blobUrl = URL.createObjectURL(blob);
                    const a = document.createElement("a"); a.href = blobUrl; a.download = v.url.substring(v.url.lastIndexOf('/') + 1) || `video_${activeId}.mp4`;
                    document.body.appendChild(a); a.click(); document.body.removeChild(a);
                    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
                    showToast("ダウンロード開始", 'system');
                } catch (e) {
                    openDownloadModal(v.url);
                } finally {
                    btn.disabled = false; txt.textContent = "ダウンロード";
                }
            }
        }

        function openDownloadModal(url) {
            document.getElementById("downloadModal").classList.remove("hidden");
            document.getElementById("iphoneDirectLink").href = url;
            document.getElementById("androidDirectLink").href = url;
        }
        function closeModal() { document.getElementById("downloadModal").classList.add("hidden"); }

        function handleSearch() {
            const input = document.getElementById("searchInput");
            const clearBtn = document.getElementById("searchClearBtn");
            searchQuery = input.value.trim().toLowerCase();

            if (searchQuery.length > 0) {
                clearBtn.classList.remove("hidden");
            } else {
                clearBtn.classList.add("hidden");
            }
            renderPlaylist();
        }

        function clearSearch() {
            const input = document.getElementById("searchInput");
            input.value = "";
            searchQuery = "";
            document.getElementById("searchClearBtn").classList.add("hidden");
            renderPlaylist();
        }

        const sortOptions = [
            { key: "newest", label: "新しい順" },
            { key: "oldest", label: "古い順" }
        ];

        function toggleSortDropdown(e) {
            if (e) e.stopPropagation();
            const dropdown = document.getElementById("sortDropdown");
            const isHidden = dropdown.classList.contains("hidden");

            if (isHidden) {
                renderSortDropdownItems();
                dropdown.classList.remove("hidden");
            } else {
                dropdown.classList.add("hidden");
            }
        }

        function renderSortDropdownItems() {
            const container = document.getElementById("sortDropdownList");
            container.innerHTML = "";

            sortOptions.forEach(opt => {
                const isSelected = opt.key === currentSortOrder;
                const btn = document.createElement("button");
                btn.className = `px-3 py-2.5 text-left text-xs font-bold transition-colors flex items-center justify-between ${
                    isSelected ? "text-brandAccent bg-brandBg" : "text-brandText hover:bg-brandBg"
                }`;
                btn.onclick = () => selectSortOption(opt.key);
                btn.innerHTML = `
                    <span>${opt.label}</span>
                    ${isSelected ? '<i data-lucide="check" class="w-3.5 h-3.5 text-brandAccent"></i>' : ''}
                `;
                container.appendChild(btn);
            });
            lucide.createIcons();
        }

        function selectSortOption(key) {
            currentSortOrder = key;
            const currentObj = sortOptions.find(o => o.key === key);
            document.getElementById("sortLabel").textContent = currentObj ? currentObj.label : "新しい順";
            document.getElementById("sortDropdown").classList.add("hidden");
            renderPlaylist();
        }

        function renderPlaylist() {
            playlistContainer.innerHTML = "";

            let filtered = videos.filter(v => {
                if (!searchQuery) return true;
                const titleMatch = v.title.toLowerCase().includes(searchQuery);
                const descMatch = v.desc.toLowerCase().includes(searchQuery);
                const dateMatch = v.date.includes(searchQuery);
                return titleMatch || descMatch || dateMatch;
            });

            if (currentSortOrder === "oldest") {
                filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
            } else {
                filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
            }

            if (filtered.length === 0) {
                playlistContainer.innerHTML = `
                    <div class="text-center py-8 text-brandMuted space-y-2 border border-dashed border-brandBorder rounded-2xl p-4">
                        <i data-lucide="search-x" class="w-8 h-8 mx-auto opacity-50"></i>
                        <p class="text-xs font-bold">該当する動画が見つかりませんでした</p>
                    </div>`;
                lucide.createIcons();
                return;
            }

            filtered.forEach(v => {
                const isActive = v.id === activeId;
                const isImage = v.type === 'image';
                const card = document.createElement("div");
                card.onclick = () => {
                    if(!isActive) loadMedia(v.id);
                };
                card.className = `group flex gap-3 p-3 rounded-2xl cursor-pointer transition-all border border-transparent ${ isActive ? "bg-brandBg border-brandBorder shadow-inner" : "bg-brandSurface/50 hover:bg-brandSurface hover:border-brandBorder" }`;
                card.innerHTML = `
                    <div class="relative w-28 lg:w-32 h-16 bg-black rounded-xl overflow-hidden flex-shrink-0 border border-brandBorder">
                        <img class="absolute inset-0 w-full h-full object-contain transition-transform group-hover:scale-105" src="${v.thumbnail}">
                        <span class="absolute bottom-1 right-1 bg-black/80 text-[9px] px-1 rounded font-mono text-white z-10 flex items-center gap-1">
                            ${isImage ? '<i data-lucide="image" class="w-2.5 h-2.5"></i>' : ''}${v.duration}
                        </span>
                        ${isActive ? '<div class="absolute inset-0 bg-brandAccent/20 flex items-center justify-center z-20"><i data-lucide="play" class="w-5 h-5 text-brandAccent fill-current"></i></div>' : ''}
                    </div>
                    <div class="flex flex-col justify-between py-0.5 min-w-0">
                        <h3 class="text-xs font-bold text-brandText line-clamp-2 group-hover:text-brandAccent transition-colors">${v.title}</h3>
                        <p class="text-[10px] text-brandMuted">${v.date}</p>
                    </div>`;
                playlistContainer.appendChild(card);
            });
            lucide.createIcons();
        }

        function setupPlayerEventListeners() {
            if (!player) return;

            playBtn.onclick = togglePlay;
            muteBtn.onclick = () => {
                player.muted = !player.muted;
                muteBtn.innerHTML = player.muted 
                    ? `<i data-lucide="volume-x" class="w-5 h-5 text-red-400"></i>` 
                    : `<i data-lucide="volume-2" class="w-5 h-5"></i>`;
                lucide.createIcons();
            };

            fullscreenBtn.onclick = () => {
                const container = document.getElementById("videoContainer");
                if (document.fullscreenElement) {
                    document.exitFullscreen().catch(() => {});
                } else if (container.requestFullscreen) {
                    container.requestFullscreen().catch(() => {});
                }
            };

            player.addEventListener("timeupdate", () => {
                if (isNaN(player.duration)) return;
                const pct = (player.currentTime / player.duration) * 100;
                updateSeekBarUI(pct);
                currentTimeText.textContent = formatTime(player.currentTime);
                durationText.textContent = formatTime(player.duration);

                if (currentUser && activeId) {
                    userResumeTimes[activeId] = player.currentTime;
                    setStoredData('resumes_' + currentUser, userResumeTimes);
                }
            });

            player.addEventListener("loadedmetadata", () => {
                durationText.textContent = formatTime(player.duration);
                videoSpinner.classList.add("hidden");
            });

            player.addEventListener("waiting", () => videoSpinner.classList.remove("hidden"));
            player.addEventListener("playing", () => videoSpinner.classList.add("hidden"));

            player.addEventListener("play", () => {
                playBtn.innerHTML = `<i data-lucide="pause" class="w-6 h-6 fill-current"></i>`;
                lucide.createIcons();
            });

            player.addEventListener("pause", () => {
                playBtn.innerHTML = `<i data-lucide="play" class="w-6 h-6 fill-current"></i>`;
                lucide.createIcons();
            });

            seekBar.addEventListener("input", (e) => {
                if (isNaN(player.duration)) return;
                const val = parseFloat(e.target.value);
                player.currentTime = (val / 100) * player.duration;
                updateSeekBarUI(val);
            });

            volumeBar.addEventListener("input", (e) => {
                const val = parseFloat(e.target.value);
                player.volume = val / 100;
                player.muted = (val === 0);
                updateVolumeBarUI(val);
            });
        }

        function setupDoubleTapGestures() {
            const leftZone = document.getElementById("leftTapZone");
            const rightZone = document.getElementById("rightTapZone");
            const leftRipple = document.getElementById("leftRipple");
            const rightRipple = document.getElementById("rightRipple");

            let lastTapLeft = 0;
            let lastTapRight = 0;

            if (leftZone) {
                leftZone.addEventListener("click", () => {
                    const now = Date.now();
                    if (now - lastTapLeft < 300) {
                        skipTime(-10);
                        showRipple(leftRipple);
                    }
                    lastTapLeft = now;
                });
            }

            if (rightZone) {
                rightZone.addEventListener("click", () => {
                    const now = Date.now();
                    if (now - lastTapRight < 300) {
                        skipTime(10);
                        showRipple(rightRipple);
                    }
                    lastTapRight = now;
                });
            }
        }

        function showRipple(el) {
            if (!el) return;
            el.classList.remove("hidden");
            el.classList.add("flex");
            setTimeout(() => {
                el.classList.add("hidden");
                el.classList.remove("flex");
            }, 500);
        }

        function setupAutoFadeControls() {
            const container = document.getElementById("videoContainer");
            const controls = document.getElementById("playerControls");

            function showControls() {
                controls.style.opacity = "1";
                controls.style.pointerEvents = "auto";
                clearTimeout(controlsTimeout);
                if (!player.paused) {
                    controlsTimeout = setTimeout(() => {
                        controls.style.opacity = "0";
                        controls.style.pointerEvents = "none";
                    }, 3000);
                }
            }

            container.addEventListener("mousemove", showControls);
            container.addEventListener("touchstart", showControls, {passive: true});
        }

        function setupKeyboardShortcuts() {
            document.addEventListener("keydown", (e) => {
                const tag = document.activeElement.tagName.toLowerCase();
                if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

                if (e.code === 'Space' || e.code === 'KeyK') {
                    e.preventDefault();
                    togglePlay();
                } else if (e.code === 'KeyF') {
                    e.preventDefault();
                    document.getElementById("fullscreenBtn").click();
                } else if (e.code === 'KeyT') {
                    e.preventDefault();
                    toggleTheaterMode();
                } else if (e.code === 'KeyM') {
                    e.preventDefault();
                    document.getElementById("muteBtn").click();
                } else if (e.code === 'ArrowLeft') {
                    e.preventDefault();
                    const v = videos.find(item => item.id === activeId);
                    if (v && (v.type === 'image' || v.images)) {
                        prevImage();
                    } else {
                        skipTime(-5);
                    }
                } else if (e.code === 'ArrowRight') {
                    e.preventDefault();
                    const v = videos.find(item => item.id === activeId);
                    if (v && (v.type === 'image' || v.images)) {
                        nextImage();
                    } else {
                        skipTime(5);
                    }
                } else if (e.code === 'ArrowUp') {
                    e.preventDefault();
                    player.volume = Math.min(1, player.volume + 0.05);
                    updateVolumeBarUI(player.volume * 100);
                } else if (e.code === 'ArrowDown') {
                    e.preventDefault();
                    player.volume = Math.max(0, player.volume - 0.05);
                    updateVolumeBarUI(player.volume * 100);
                }
            });
        }

        function formatTime(seconds) {
            if (isNaN(seconds)) return "00:00";
            const m = Math.floor(seconds / 60);
            const s = Math.floor(seconds % 60);
            return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }

        function updateSeekBarUI(percent) {
            seekBar.value = percent;
            seekBar.style.setProperty('--seek-percent', percent + '%');
        }

        function updateVolumeBarUI(val) {
            volumeBar.value = val;
            volumeBar.style.setProperty('--volume-percent', val + '%');
            if (volumeLevelText) volumeLevelText.textContent = Math.round(val) + '%';
        }

        function resetControlsTimeout() {
            const controls = document.getElementById("playerControls");
            if (!controls) return;
            controls.style.opacity = "1";
            controls.style.pointerEvents = "auto";
            clearTimeout(controlsTimeout);
            if (!player.paused) {
                controlsTimeout = setTimeout(() => {
                    controls.style.opacity = "0";
                    controls.style.pointerEvents = "none";
                }, 3000);
            }
        }

        let toastTimer = null;
        function showToast(msg, category = 'system') {
            if (notificationSettings[category] === false) return;

            const toast = document.getElementById('toast');
            const toastMsg = document.getElementById('toastMsg');
            toastMsg.textContent = msg;

            toast.classList.remove('translate-y-10', 'opacity-0', 'pointer-events-none');
            toast.classList.add('translate-y-0', 'opacity-100');

            clearTimeout(toastTimer);
            toastTimer = setTimeout(() => {
                toast.classList.add('translate-y-10', 'opacity-0', 'pointer-events-none');
                toast.classList.remove('translate-y-0', 'opacity-100');
            }, 2500);
        }
