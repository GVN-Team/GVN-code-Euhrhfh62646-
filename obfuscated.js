// ====================================================================================
// アプリ固有のID
window.APP_UNIQUE_ID = "SiteLikes";
// ====================================================================================

// 固有の接頭辞を作成
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
    if (input) input.value = '';
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

const dummyLocalDB = [
    { username: "UserName The ggrks", password: "Password The Annan" }
];

const externalLinks = [
    { no: 1, title: "Likes", url: "https://gvn-team.github.io/Likes-Vm1wR2IxWXlUblJTYkdoUFYwWndZVlJYTVc5aU1XeDBXWHBzVVZWVU1Eaz0-/", icon: "", color: "white", borderColor: "red" }
];

let currentUser = null;
let userWatchHistory = [];
let userWatchLater = [];
let userResumeTimes = {};

window.onload = function() {
    lucide.createIcons();
    
    // Discord OAuthのコールバックをチェック
    handleDiscordOAuthCallback();

    const savedUser = getStoredData('session_user', null);
    if (savedUser && !currentUser) {
        applyLoginState(savedUser);
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
    if (!dotsEl) return;
    dotInterval = setInterval(() => {
        count = (count % 3) + 1;
        dotsEl.textContent = ".".repeat(count);
    }, 100);
}

async function handleLogin(event) {
    if (event) event.preventDefault();
    const userInp = document.getElementById('userId');
    const passInp = document.getElementById('userPwd');
    const errBox = document.getElementById('loginError');
    const btnArea = document.getElementById('loginBtnContainer');
    const loadArea = document.getElementById('loadingArea');
    const loadMsg = document.getElementById('loadingMsg');

    if (errBox) errBox.classList.add('hidden');
    if (btnArea) btnArea.classList.add('hidden');
    if (loadArea) {
        loadArea.classList.remove('hidden');
        loadArea.classList.add('flex');
    }

    startDots();
    
    const steps = 3; 
    for (let i = 0; i < steps; i++) {
        if (loadMsg) loadMsg.textContent = loaderMessages[Math.floor(Math.random() * loaderMessages.length)];
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
        applyLoginState(foundUser.username);
    } else {
        if (userInp) userInp.value = "";
        if (passInp) passInp.value = "";
        if (loadArea) {
            loadArea.classList.add('hidden');
            loadArea.classList.remove('flex');
        }
        if (btnArea) btnArea.classList.remove('hidden');
        if (errBox) {
            errBox.classList.remove('hidden'); errBox.classList.add('flex');
        }
        lucide.createIcons();
    }
}

function applyLoginState(username) {
    currentUser = username;
    
    userWatchHistory = getStoredData('history_' + currentUser, []);
    userWatchLater = getStoredData('watchlater_' + currentUser, []);
    userResumeTimes = getStoredData('resumes_' + currentUser, {});

    window.currentUser = currentUser;
    
    if (window.db && window.getAuthUser && window.getAuthUser()) {
        syncUserDataFromCloud(); 
    }

    const headerUsername = document.getElementById('headerUsername');
    if (headerUsername) headerUsername.textContent = username;
    
    const loginScreen = document.getElementById('loginScreen');
    if (loginScreen) {
        loginScreen.classList.add('hidden');
        loginScreen.classList.remove('flex');
    }
    
    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
        mainContent.classList.remove('hidden');
        mainContent.classList.add('flex');
    }
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
    if (menu) menu.classList.toggle('hidden');
}

function closeUserMenu() {
    const menu = document.getElementById('userMenuDropdown');
    if (menu) menu.classList.add('hidden');
}

function logout() {
    try {
        localStorage.removeItem(STORAGE_PREFIX + 'session_user');
    } catch (e) {}

    currentUser = null;
    window.currentUser = null;
    userWatchHistory = [];
    userWatchLater = [];
    userResumeTimes = {};

    closeUserMenu();
    if (player) {
        player.pause();
        player.src = "";
    }
    
    const mainContent = document.getElementById('mainContent');
    if (mainContent) {
        mainContent.classList.add('hidden');
        mainContent.classList.remove('flex');
    }
    const loginScreen = document.getElementById('loginScreen');
    if (loginScreen) {
        loginScreen.classList.remove('hidden');
        loginScreen.classList.add('flex');
    }
    
    const userId = document.getElementById('userId');
    const userPwd = document.getElementById('userPwd');
    if (userId) userId.value = "";
    if (userPwd) userPwd.value = "";
    
    const loadingArea = document.getElementById('loadingArea');
    const loginBtnContainer = document.getElementById('loginBtnContainer');
    const loginError = document.getElementById('loginError');
    if (loadingArea) loadingArea.classList.add('hidden');
    if (loginBtnContainer) loginBtnContainer.classList.remove('hidden');
    if (loginError) loginError.classList.add('hidden');
    
    showToast("ログアウトしました", "system");
}

document.addEventListener('click', (e) => {
    const userMenu = document.getElementById('userMenuDropdown');
    const userBtn = document.getElementById('userMenuBtn');
    if (userMenu && !userMenu.classList.contains('hidden')) {
        if (!userMenu.contains(e.target) && userBtn && !userBtn.contains(e.target)) {
            userMenu.classList.add('hidden');
        }
    }

    const sortDropdown = document.getElementById('sortDropdown');
    const sortBtn = document.getElementById('sortBtn');
    if (sortDropdown && !sortDropdown.classList.contains('hidden')) {
        if (!sortDropdown.contains(e.target) && sortBtn && !sortBtn.contains(e.target)) {
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
    if (!container) return;
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
    if (!btn) return;
    if (isAdded) {
        btn.innerHTML = `<i data-lucide="bookmark" class="w-5 h-5 text-amber-400 fill-amber-400"></i>`;
    } else {
        btn.innerHTML = `<i data-lucide="bookmark" class="w-5 h-5 text-amber-400 fill-transparent"></i>`;
    }
    lucide.createIcons();
}

function openWatchLaterModal() {
    const container = document.getElementById('watchLaterListContainer');
    if (!container) return;
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
    if (!modal || !content) return;
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        content.classList.remove('scale-95'); content.classList.add('scale-100');
    }, 10);
}

function closeSettings() {
    const modal = document.getElementById('settingsModal');
    const content = document.getElementById('settingsModalContent');
    if (!modal || !content) return;
    modal.classList.add('opacity-0');
    content.classList.remove('scale-100'); content.classList.add('scale-95');
    setTimeout(() => modal.classList.add('hidden'), 300);
}

function renderExternalLinks() {
    const container = document.getElementById("linksList");
    if (!container) return;
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

const videos = [
    { id: 1, 
        type: "video",
        title: "おすすめ", 
        url: "https://github.com/GVN-Team/UjFaT0xVMVFOQzFGYm1OdlpHVXRjbVZ6ZEc5eVpTMUtjMnBrYUZOb1oyUm5SR2hvWkNOZEkzMGxY-U1Y3ZTExN1hRPT0-/raw/refs/heads/UjFaT0xVMVFOQzFGYm1OdlpHVXRjbVZ6ZEc5eVpTMWljbUZ1WTJndFNuTnFjMmhLWkdoa2FFUm9h-R1pvUm1obWFFZDdJMTBqVzF3cQ0KWENwOEpDUjhLMTBxZXlvOVhPS0NyRUF1/33549.mp4", 
        thumbnail: "https://github.com/GVN-Team/UjFaT0xVMVFOQzFGYm1OdlpHVXRjbVZ6ZEc5eVpTMUtjMnBrYUZOb1oyUm5SR2hvWkNOZEkzMGxY-U1Y3ZTExN1hRPT0-/raw/refs/heads/UjFaT0xVMVFOQzFGYm1OdlpHVXRjbVZ6ZEc5eVpTMWljbUZ1WTJndFNuTnFjMmhLWkdoa2FFUm9h-R1pvUm1obWFFZDdJMTBqVzF3cQ0KWENwOEpDUjhLMTBxZXlvOVhPS0NyRUF1/IMG_8398.png", 
        duration: "2:20", 
        date: "2026/08/26", 
        desc: "File Size : 7.1MB" 
    }
];

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
    
    if (player) player.playbackRate = appConfig.playbackRate;
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
    if (input) {
        input.value = tagText;
        handleSearch();
    }
}

function loadMedia(id) {
    const v = videos.find(item => item.id === id);
    if (!v) return;
    activeId = id;
    
    if (vTitle) vTitle.textContent = v.title;
    if (vDate) vDate.textContent = `公開日: ${v.date}`;
    if (vDesc) vDesc.innerHTML = formatHashtags(v.desc);
    renderPlaylist();
    updateWatchLaterBtnUI();
    recordHistory(v.id);

    const imageViewer = document.getElementById('imageViewer');
    const controls = document.getElementById('playerControls');
    const touchOverlay = document.getElementById('touchGestureOverlay');

    if (v.type === 'image' || v.images) {
        if (player) player.pause();
        if (player) player.classList.add('hidden');
        if (controls) controls.classList.add('hidden');
        if (touchOverlay) touchOverlay.classList.add('hidden');
        
        if (imageViewer) {
            imageViewer.classList.remove('hidden');
            imageViewer.classList.add('flex');
        }
        
        setupImageViewer(v.images);
    } else {
        if (imageViewer) {
            imageViewer.classList.add('hidden');
            imageViewer.classList.remove('flex');
        }
        
        if (player) player.classList.remove('hidden');
        if (controls) controls.classList.remove('hidden');
        if (touchOverlay) touchOverlay.classList.remove('hidden');

        if (playerSrc) playerSrc.src = v.url;
        if (player) {
            player.poster = v.thumbnail;
            player.load();
            player.playbackRate = appConfig.playbackRate;
        }
        if (videoSpinner) videoSpinner.classList.remove("hidden");
        updateSeekBarUI(0);

        const savedTime = userResumeTimes[v.id] || 0;
        if (savedTime > 5) {
            pendingResumeTime = savedTime;
            const resumeText = document.getElementById('resumeTimeText');
            if (resumeText) resumeText.textContent = `再生位置: ${formatTime(savedTime)}`;
            const resumeModal = document.getElementById('resumeModal');
            if (resumeModal) resumeModal.classList.remove('hidden');
        } else {
            startVideoPlayback();
        }
    }
}

let currentImageIndex = 0;
let currentImages = [];

function setupImageViewer(images) {
    if (!images) return;
    currentImages = images;
    currentImageIndex = 0;
    
    const track = document.getElementById('imageTrack');
    const indicators = document.getElementById('imageIndicators');
    const totalNum = document.getElementById('totalImgNum');
    if (totalNum) totalNum.textContent = images.length;
    
    if (track) track.innerHTML = '';
    if (indicators) indicators.innerHTML = '';
    
    images.forEach((src, idx) => {
        const img = document.createElement('img');
        img.src = src;
        img.className = 'w-full h-full object-contain flex-shrink-0 select-none';
        img.ondragstart = () => false;
        if (track) track.appendChild(img);
        
        const dot = document.createElement('div');
        dot.className = `h-2 rounded-full transition-all duration-300 ${idx === 0 ? 'bg-brandAccent w-4' : 'bg-white/50 w-2'}`;
        if (indicators) indicators.appendChild(dot);
    });
    
    updateImageViewer();
}

function updateImageViewer() {
    const track = document.getElementById('imageTrack');
    if (track) track.style.transform = `translateX(-${currentImageIndex * 100}%)`;
    
    const currentNum = document.getElementById('currentImgNum');
    if (currentNum) currentNum.textContent = currentImageIndex + 1;
    
    const indicators = document.getElementById('imageIndicators');
    if (indicators) {
        const dots = indicators.children;
        for (let i = 0; i < dots.length; i++) {
            if (i === currentImageIndex) {
                dots[i].className = 'h-2 rounded-full bg-brandAccent transition-all duration-300 w-4';
            } else {
                dots[i].className = 'h-2 rounded-full bg-white/50 transition-all duration-300 w-2';
            }
        }
    }
    
    const prevBtn = document.getElementById('prevImgBtn');
    const nextBtn = document.getElementById('nextImgBtn');
    if (prevBtn) prevBtn.disabled = currentImageIndex === 0;
    if (nextBtn) nextBtn.disabled = currentImageIndex === currentImages.length - 1;
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
    if (!viewer) return;
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
    const modal = document.getElementById('resumeModal');
    if (modal) modal.classList.add('hidden');
    if (shouldResume && pendingResumeTime > 0) {
        if (player) player.currentTime = pendingResumeTime;
        showToast(`続きから再生 (${formatTime(pendingResumeTime)})`, 'resume');
    } else {
        if (player) player.currentTime = 0;
    }
    startVideoPlayback();
}

function startVideoPlayback() {
    if (!player) return;
    if (appConfig.autoPlay) {
        player.play().then(() => {
            if (playBtn) playBtn.innerHTML = `<i data-lucide="pause" class="w-6 h-6 fill-current"></i>`;
            lucide.createIcons();
        }).catch((err) => {
            if (playBtn) playBtn.innerHTML = `<i data-lucide="play" class="w-6 h-6 fill-current"></i>`;
            lucide.createIcons();
        });
    } else {
        if (playBtn) playBtn.innerHTML = `<i data-lucide="play" class="w-6 h-6 fill-current"></i>`;
        lucide.createIcons();
        player.addEventListener('canplay', () => { if (videoSpinner) videoSpinner.classList.add("hidden"); }, {once:true});
    }
    resetControlsTimeout();
}

function skipTime(seconds) {
    if (!player || isNaN(player.duration)) return;
    player.currentTime = Math.min(Math.max(player.currentTime + seconds, 0), player.duration);
    resetControlsTimeout();
}

function toggleTheaterMode() {
    isTheaterMode = !isTheaterMode;
    const grid = document.getElementById("mainLayoutGrid");
    const playerCol = document.getElementById("playerColumn");
    const theaterBtn = document.getElementById("theaterBtn");

    if (isTheaterMode) {
        if (grid) { grid.classList.remove("max-w-6xl"); grid.classList.add("max-w-7xl"); }
        if (playerCol) { playerCol.classList.remove("lg:col-span-2"); playerCol.classList.add("lg:col-span-3"); }
        if (theaterBtn) theaterBtn.innerHTML = `<i data-lucide="rectangle-vertical" class="w-5 h-5 text-brandAccent"></i>`;
        showToast("大画面モード: ON", 'system');
    } else {
        if (grid) { grid.classList.remove("max-w-7xl"); grid.classList.add("max-w-6xl"); }
        if (playerCol) { playerCol.classList.remove("lg:col-span-3"); playerCol.classList.add("lg:col-span-2"); }
        if (theaterBtn) theaterBtn.innerHTML = `<i data-lucide="rectangle-horizontal" class="w-5 h-5"></i>`;
        showToast("大画面モード: OFF", 'system');
    }
    lucide.createIcons();
}

async function shareVideo() {
    const finalShareUrl = `https://gvn-team.github.io/Likes-Vm1wR2IxWXlUblJTYkdoUFYwWndZVlJYTVc5aU1XeDBXWHBzVVZWVU1Eaz0-/`;
    if (navigator.share) {
        try {
            await navigator.share({ title: "Likes - GVN", text: "Likes - GVN", url: finalShareUrl });
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
        if (btn) btn.disabled = true; 
        if (txt) txt.textContent = "準備中...";
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
                if (len && txt) txt.textContent = `${Math.round((rec / len) * 100)}%`;
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
            if (btn) btn.disabled = false; 
            if (txt) txt.textContent = "ダウンロード";
        }
    }
}

function openDownloadModal(url) {
    const modal = document.getElementById("downloadModal");
    if (modal) modal.classList.remove("hidden");
    const iph = document.getElementById("iphoneDirectLink");
    const andr = document.getElementById("androidDirectLink");
    if (iph) iph.href = url;
    if (andr) andr.href = url;
}
function closeModal() { 
    const modal = document.getElementById("downloadModal");
    if (modal) modal.classList.add("hidden"); 
}

function handleSearch() {
    const input = document.getElementById("searchInput");
    const clearBtn = document.getElementById("searchClearBtn");
    if (!input) return;
    searchQuery = input.value.trim().toLowerCase();

    if (searchQuery.length > 0) {
        if (clearBtn) clearBtn.classList.remove("hidden");
    } else {
        if (clearBtn) clearBtn.classList.add("hidden");
    }
    renderPlaylist();
}

function clearSearch() {
    const input = document.getElementById("searchInput");
    if (input) input.value = "";
    searchQuery = "";
    const clearBtn = document.getElementById("searchClearBtn");
    if (clearBtn) clearBtn.classList.add("hidden");
    renderPlaylist();
}

const sortOptions = [
    { key: "newest", label: "新しい順" },
    { key: "oldest", label: "古い順" }
];

function toggleSortDropdown(e) {
    if (e) e.stopPropagation();
    const dropdown = document.getElementById("sortDropdown");
    if (!dropdown) return;
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
    if (!container) return;
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
    const label = document.getElementById("sortLabel");
    if (label) label.textContent = currentObj ? currentObj.label : "新しい順";
    const dropdown = document.getElementById("sortDropdown");
    if (dropdown) dropdown.classList.add("hidden");
    renderPlaylist();
}

function renderPlaylist() {
    if (!playlistContainer) return;
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

function setupDoubleTapGestures() {
    const leftZone = document.getElementById("leftTapZone");
    const rightZone = document.getElementById("rightTapZone");
    if (!leftZone || !rightZone) return;

    let lastTapLeft = 0;
    let lastTapRight = 0;
    let singleTapTimer = null;

    leftZone.addEventListener("click", (e) => {
        const now = Date.now();
        if (now - lastTapLeft < 300) {
            clearTimeout(singleTapTimer);
            skipTime(-10);
            showRipple("leftRipple");
        } else {
            singleTapTimer = setTimeout(() => {
                toggleControlsVisibility();
            }, 250);
        }
        lastTapLeft = now;
    });

    rightZone.addEventListener("click", (e) => {
        const now = Date.now();
        if (now - lastTapRight < 300) {
            clearTimeout(singleTapTimer);
            skipTime(10);
            showRipple("rightRipple");
        } else {
            singleTapTimer = setTimeout(() => {
                toggleControlsVisibility();
            }, 250);
        }
        lastTapRight = now;
    });
}

function showRipple(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove("hidden");
    setTimeout(() => {
        el.classList.add("hidden");
    }, 500);
}

function toggleControlsVisibility() {
    const controls = document.getElementById("playerControls");
    if (!controls) return;
    if (controls.classList.contains("opacity-0")) {
        controls.classList.remove("opacity-0", "pointer-events-none");
        resetControlsTimeout();
    } else {
        if (player && !player.paused) {
            controls.classList.add("opacity-0", "pointer-events-none");
        }
    }
}

function resetControlsTimeout() {
    const controls = document.getElementById("playerControls");
    if (!controls) return;
    controls.classList.remove("opacity-0", "pointer-events-none");
    clearTimeout(controlsTimeout);
    if (player && !player.paused) {
        controlsTimeout = setTimeout(() => {
            controls.classList.add("opacity-0", "pointer-events-none");
        }, 3000);
    }
}

function setupAutoFadeControls() {
    const container = document.getElementById("videoContainer");
    if (!container) return;
    container.addEventListener("mousemove", resetControlsTimeout);
    container.addEventListener("touchstart", resetControlsTimeout, { passive: true });
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

        const imgViewer = document.getElementById('imageViewer');
        const isImageMode = imgViewer && !imgViewer.classList.contains('hidden');

        switch (e.code) {
            case 'Space':
            case 'KeyK':
                e.preventDefault();
                if(!isImageMode) togglePlay();
                break;
            case 'KeyT':
                e.preventDefault();
                toggleTheaterMode();
                break;
            case 'KeyF':
                e.preventDefault();
                toggleFullscreen();
                break;
            case 'KeyM':
                e.preventDefault();
                if(!isImageMode && muteBtn) muteBtn.click();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                if (isImageMode) prevImage(); else skipTime(-5);
                break;
            case 'ArrowRight':
                e.preventDefault();
                if (isImageMode) nextImage(); else skipTime(5);
                break;
            case 'ArrowUp':
                e.preventDefault();
                if(!isImageMode) changeVolume(5);
                break;
            case 'ArrowDown':
                e.preventDefault();
                if(!isImageMode) changeVolume(-5);
                break;
        }
    });
}

function changeVolume(delta) {
    if (!volumeBar || !player) return;
    let current = parseInt(volumeBar.value);
    let next = Math.min(Math.max(current + delta, 0), 100);
    volumeBar.value = next;
    player.volume = next / 100;
    player.muted = next === 0;
    updateVolumeBarUI(next);
    updateVolumeIcon();
}

function showToast(msg, category = 'system') {
    if (category && notificationSettings[category] === false) return;
    const t = document.getElementById("toast");
    const msgEl = document.getElementById("toastMsg");
    if (!t || !msgEl) return;
    msgEl.textContent = msg;
    t.classList.remove("translate-y-10", "opacity-0", "pointer-events-none");
    t.classList.add("translate-y-10", "opacity-100");
    setTimeout(() => { t.classList.remove("translate-y-0", "opacity-100"); t.classList.add("translate-y-10", "opacity-0", "pointer-events-none"); }, 3500);
}

function updateSeekBarUI(p) { if(seekBar) { seekBar.value = p; seekBar.style.setProperty('--seek-percent', `${p}%`); } }
function updateVolumeBarUI(p) { if(volumeBar) { volumeBar.value = p; volumeBar.style.setProperty('--volume-percent', `${p}%`); if(volumeLevelText) volumeLevelText.textContent = `${p}%`; } }
function formatTime(sec) { const m = Math.floor(sec/60).toString().padStart(2,'0'); const s = Math.floor(sec%60).toString().padStart(2,'0'); return `${m}:${s}`; }

function toggleFullscreen() {
    const c = document.getElementById("videoContainer");
    if (!c) return;
    if (player && player.webkitEnterFullscreen && /iPhone|iPod/.test(navigator.userAgent)) { player.webkitEnterFullscreen(); return; }
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        if (c.requestFullscreen) c.requestFullscreen(); else if (c.webkitRequestFullscreen) c.webkitRequestFullscreen();
    } else {
        if (document.exitFullscreen) document.exitFullscreen(); else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }
}

async function togglePiP() {
    if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
    } else if (document.pictureInPictureEnabled && player) {
        try {
            await player.requestPictureInPicture();
        } catch (err) {
            showToast("PiPに対応していません", 'system');
        }
    }
}

document.addEventListener('fullscreenchange', onFullscreenChange); document.addEventListener('webkitfullscreenchange', onFullscreenChange);
function onFullscreenChange() {
    const isFull = document.fullscreenElement || document.webkitFullscreenElement;
    if (fullscreenBtn) fullscreenBtn.innerHTML = isFull ? `<i data-lucide="minimize" class="w-5 h-5"></i>` : `<i data-lucide="maximize" class="w-5 h-5"></i>`;
    const container = document.getElementById("videoContainer");
    if (container) {
        isFull ? container.classList.remove("rounded-theme") : container.classList.add("rounded-theme");
    }
    lucide.createIcons();
}

let resumeSaveTimer = null;

function setupPlayerEventListeners() {
    if (!player) return;
    let dragging = false;
    if (playBtn) playBtn.onclick = togglePlay;
    player.oncanplay = () => { if (videoSpinner) videoSpinner.classList.add("hidden"); };
    player.onwaiting = () => { if (videoSpinner) videoSpinner.classList.remove("hidden"); };
    
    player.ontimeupdate = () => { 
        if(!dragging && !isNaN(player.duration)) { 
            updateSeekBarUI((player.currentTime/player.duration)*100); 
            if (currentTimeText) currentTimeText.textContent = formatTime(player.currentTime); 
            
            if (currentUser && player.currentTime > 5 && player.currentTime < player.duration - 5) {
                userResumeTimes[activeId] = Math.floor(player.currentTime);
                if (!resumeSaveTimer) {
                    resumeSaveTimer = setTimeout(() => {
                        saveUserDataToCloud();
                        resumeSaveTimer = null;
                    }, 3000);
                }
            }
        } 
    };
    player.onloadedmetadata = () => { if (durationText) durationText.textContent = formatTime(player.duration); };
    
    player.onended = () => {
        delete userResumeTimes[activeId];
        saveUserDataToCloud();
        if (playBtn) playBtn.innerHTML = `<i data-lucide="play" class="w-6 h-6 fill-current"></i>`;
        lucide.createIcons();
        resetControlsTimeout();
    };

    if (seekBar) {
        seekBar.onmousedown = seekBar.ontouchstart = () => dragging = true;
        seekBar.oninput = () => { seekBar.style.setProperty('--seek-percent', `${seekBar.value}%`); if(!isNaN(player.duration)) { player.currentTime = (seekBar.value/100)*player.duration; if (currentTimeText) currentTimeText.textContent = formatTime(player.currentTime); } };
        seekBar.onchange = window.onmouseup = window.ontouchend = () => { if(dragging) { dragging=false; if(!isNaN(player.duration)) player.currentTime = (seekBar.value/100)*player.duration; } };
    }
    if (volumeBar) {
        volumeBar.oninput = () => { player.volume = volumeBar.value/100; player.muted = player.volume===0; updateVolumeBarUI(volumeBar.value); updateVolumeIcon(); };
    }
    if (muteBtn) {
        muteBtn.onclick = () => { player.muted = !player.muted; updateVolumeBarUI(player.muted ? 0 : Math.round(player.volume*100)); updateVolumeIcon(); };
    }
    if (fullscreenBtn) fullscreenBtn.onclick = toggleFullscreen;
}

function togglePlay() {
    if (!player) return;
    if (player.paused) { 
        player.play(); 
        if (playBtn) playBtn.innerHTML = `<i data-lucide="pause" class="w-6 h-6 fill-current"></i>`; 
    } else { 
        player.pause(); 
        if (playBtn) playBtn.innerHTML = `<i data-lucide="play" class="w-6 h-6 fill-current"></i>`; 
    }
    resetControlsTimeout();
    lucide.createIcons();
}

function updateVolumeIcon() {
    if (!muteBtn || !player) return;
    if (player.muted || player.volume===0) muteBtn.innerHTML = `<i data-lucide="volume-x" class="w-5 h-5 text-red-500"></i>`;
    else if (player.volume<0.5) muteBtn.innerHTML = `<i data-lucide="volume-1" class="w-5 h-5"></i>`;
    else muteBtn.innerHTML = `<i data-lucide="volume-2" class="w-5 h-5"></i>`;
    lucide.createIcons();
}

// ====================================================================================
// Discord 認証拡張機能 (既存コードは保持したまま追加)
// ====================================================================================

const DISCORD_CONFIG = {
    clientId: window.DISCORD_CLIENT_ID || "123456789012345678", // 必要に応じて置き換え可能
    redirectUri: window.DISCORD_REDIRECT_URI || window.location.origin + window.location.pathname,
    scope: "identify email"
};

/**
 * Discord ログイン画面へリダイレクト
 */
function loginWithDiscord() {
    if (window.SITE_CONFIG && window.SITE_CONFIG.discord && window.SITE_CONFIG.discord.loginUrl) {
        window.location.href = window.SITE_CONFIG.discord.loginUrl;
        return;
    }

    const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${encodeURIComponent(DISCORD_CONFIG.clientId)}&redirect_uri=${encodeURIComponent(DISCORD_CONFIG.redirectUri)}&response_type=token&scope=${encodeURIComponent(DISCORD_CONFIG.scope)}`;
    window.location.href = authUrl;
}

/**
 * URLハッシュやクエリからDiscord OAuthレスポンスを検出しログイン
 */
function handleDiscordOAuthCallback() {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const queryParams = new URLSearchParams(window.location.search);

    const accessToken = hashParams.get('access_token');
    const code = queryParams.get('code');

    if (accessToken) {
        // Access Tokenからユーザー情報を取得
        fetch('https://discord.com/api/users/@me', {
            headers: {
                authorization: `Bearer ${accessToken}`
            }
        })
        .then(res => res.json())
        .then(userData => {
            if (userData && userData.username) {
                const discordName = `${userData.username}`;
                setStoredData('session_user', discordName);
                applyLoginState(discordName);
                showToast(`Discordアカウント (${discordName}) でログインしました`, "system");
                // URLハッシュをきれいに除去
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        })
        .catch(err => {
            console.error('Discord user fetch failed:', err);
            showToast('Discord認証に失敗しました', 'system');
        });
    } else if (code) {
        // OAuth Codeレスポンス
        const discordUser = "Discord User";
        setStoredData('session_user', discordUser);
        applyLoginState(discordUser);
        showToast("Discord認証に成功しました", "system");
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}
