// ==========================================
// 1. グローバル設定 & サンプルデータ構造
// ==========================================

// デフォルトの認証ユーザー設定 (ユーザー名: パスワード)
const AUTH_USERS = {
    "admin": "admin123",
    "user": "password",
    "guest": "guest2026"
};

// ヘッダーに表示する外部リンクデータ
const EXTERNAL_LINKS = [
    { title: "Discord", url: "https://discord.gg/", icon: "message-square" },
    { title: "公式Wiki", url: "https://GVN-ORG-doks.onrender.com/", icon: "file-text" },
    { title: "サポート", url: "https://GVN-ORG-doks.onrender.com/", icon: "help-circle" }
];

// サンプル動画・メディアデータ一覧
const VIDEO_DATA = [
    {
        id: "vid-001",
        title: "【限定公開】JC&JK 街頭インタビュー＆オフショット ダイジェスト v1",
        date: "2026/03/15",
        desc: "最新の街頭インタビュー動画です！\n＃限定配布 ＃JC ＃JK ＃オフショット",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        thumbnail: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80",
        downloadUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        type: "video"
    },
    {
        id: "vid-002",
        title: "【高画質】特別フォトギャラリーアルバム Vol.1",
        date: "2026/03/10",
        desc: "全5枚の高画質フォトセットです。左右のスワイプまたは矢印キーで切り替えられます。\n＃フォト集 ＃高画質 ＃スペシャル",
        type: "image",
        images: [
            "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=80"
        ],
        thumbnail: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80",
        downloadUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1200&q=80"
    },
    {
        id: "vid-003",
        title: "【未公開】ショートダンス＆企画NG集コレクション",
        date: "2026/02/28",
        desc: "SNSで話題になったダンス動画の未公開NG集です。\n＃ダンス ＃NG集 ＃オリジナル",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        thumbnail: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
        downloadUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        type: "video"
    },
    {
        id: "vid-004",
        title: "【メイキング】撮影舞台裏・裏側ドキュメンタリー",
        date: "2026/02/14",
        desc: "普段は見られない撮影現場のバックステージ模様をお届けします。\n＃メイキング ＃舞台裏",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        thumbnail: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
        downloadUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        type: "video"
    }
];

// アプリケーション状態変数
let state = {
    currentUser: null,
    currentVideoIndex: 0,
    sortOrder: "newest", // 'newest' | 'oldest' | 'title'
    searchQuery: "",
    isPlaying: false,
    currentImageIndex: 0,
    resumePendingTime: 0,
    pendingVideoIndex: null,
    watchLater: JSON.parse(localStorage.getItem('app_watch_later') || '[]'),
    history: JSON.parse(localStorage.getItem('app_history') || '[]'),
    resumePositions: JSON.parse(localStorage.getItem('app_resume_positions') || '{}'),
    notifications: JSON.parse(localStorage.getItem('app_notifications') || JSON.stringify({
        playbackRate: true,
        share: true,
        watchLater: true,
        historyClear: true,
        resume: true,
        system: true
    })),
    config: JSON.parse(localStorage.getItem('app_config') || JSON.stringify({
        playbackRate: 1.0,
        autoPlay: true
    }))
};

// DOM要素参照
let elements = {};

document.addEventListener('DOMContentLoaded', () => {
    initDOMElements();
    initApp();
});

function initDOMElements() {
    elements = {
        loginScreen: document.getElementById('loginScreen'),
        loginForm: document.getElementById('loginForm'),
        userIdInput: document.getElementById('userId'),
        userPwdInput: document.getElementById('userPwd'),
        loadingArea: document.getElementById('loadingArea'),
        loadingMsg: document.getElementById('loadingMsg'),
        loadingDots: document.getElementById('loadingDots'),
        loginError: document.getElementById('loginError'),
        loginErrorMsg: document.getElementById('loginErrorMsg'),
        loginBtnContainer: document.getElementById('loginBtnContainer'),
        
        mainContent: document.getElementById('mainContent'),
        headerUsername: document.getElementById('headerUsername'),
        userMenuDropdown: document.getElementById('userMenuDropdown'),
        linksList: document.getElementById('linksList'),
        
        mainPlayer: document.getElementById('mainPlayer'),
        playerSource: document.getElementById('playerSource'),
        videoContainer: document.getElementById('videoContainer'),
        playerControls: document.getElementById('playerControls'),
        seekBar: document.getElementById('seekBar'),
        currentTimeText: document.getElementById('currentTime'),
        durationText: document.getElementById('duration'),
        playBtn: document.getElementById('playBtn'),
        muteBtn: document.getElementById('muteBtn'),
        volumeBar: document.getElementById('volumeBar'),
        volumeLevel: document.getElementById('volumeLevel'),
        videoSpinner: document.getElementById('videoSpinner'),
        
        imageViewer: document.getElementById('imageViewer'),
        imageTrack: document.getElementById('imageTrack'),
        prevImgBtn: document.getElementById('prevImgBtn'),
        nextImgBtn: document.getElementById('nextImgBtn'),
        imageIndicators: document.getElementById('imageIndicators'),
        currentImgNum: document.getElementById('currentImgNum'),
        totalImgNum: document.getElementById('totalImgNum'),
        
        leftTapZone: document.getElementById('leftTapZone'),
        rightTapZone: document.getElementById('rightTapZone'),
        leftRipple: document.getElementById('leftRipple'),
        rightRipple: document.getElementById('rightRipple'),
        
        videoTitle: document.getElementById('videoTitle'),
        videoDate: document.getElementById('videoDate'),
        videoDesc: document.getElementById('videoDesc'),
        watchLaterIcon: document.getElementById('watchLaterIcon'),
        
        playlist: document.getElementById('playlist'),
        searchInput: document.getElementById('searchInput'),
        searchClearBtn: document.getElementById('searchClearBtn'),
        sortBtn: document.getElementById('sortBtn'),
        sortLabel: document.getElementById('sortLabel'),
        sortDropdown: document.getElementById('sortDropdown'),
        sortDropdownList: document.getElementById('sortDropdownList'),
        
        toast: document.getElementById('toast'),
        toastMsg: document.getElementById('toastMsg'),
        
        settingsModal: document.getElementById('settingsModal'),
        resumeModal: document.getElementById('resumeModal'),
        resumeTimeText: document.getElementById('resumeTimeText'),
        shortcutsModal: document.getElementById('shortcutsModal'),
        historyModal: document.getElementById('historyModal'),
        historyListContainer: document.getElementById('historyListContainer'),
        watchLaterModal: document.getElementById('watchLaterModal'),
        watchLaterListContainer: document.getElementById('watchLaterListContainer'),
        notificationSettingsModal: document.getElementById('notificationSettingsModal'),
        downloadModal: document.getElementById('downloadModal'),
        iphoneDirectLink: document.getElementById('iphoneDirectLink'),
        androidDirectLink: document.getElementById('androidDirectLink')
    };
}

function initApp() {
    renderExternalLinks();
    setupPlayerEventListeners();
    setupGestureListeners();
    setupSortMenu();
    setupKeyboardShortcuts();
    checkExistingSession();
    refreshLucideIcons();
}

function refreshLucideIcons() {
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// ==========================================
// 2. 認証 & ログイン処理
// ==========================================

function checkExistingSession() {
    const savedUser = localStorage.getItem('app_session_user');
    if (savedUser) {
        state.currentUser = savedUser;
        showMainInterface();
    }
}

function handleLogin(event) {
    if (event) event.preventDefault();
    
    const username = elements.userIdInput.value.trim();
    const password = elements.userPwdInput.value.trim();
    
    hideLoginError();
    showLoginLoading("認証情報を確認中");

    setTimeout(() => {
        if (AUTH_USERS[username] && AUTH_USERS[username] === password) {
            state.currentUser = username;
            localStorage.setItem('app_session_user', username);
            hideLoginLoading();
            showMainInterface();
            showToast(`おかえりなさい、${username} さん！`, 'system');
        } else {
            hideLoginLoading();
            showLoginError("ユーザー名またはパスワードが正しくありません");
        }
    }, 1200);
}

function handleDiscordLogin() {
    // obfuscation.js 側でオーバーライド・拡張可能
    if (typeof window.triggerDiscordOAuth === 'function') {
        window.triggerDiscordOAuth();
    } else {
        showLoginLoading("Discord連携を開始中");
        setTimeout(() => {
            hideLoginLoading();
            showToast("obfuscation.js の読み込みを待機しています", "system");
        }, 1000);
    }
}

function logout() {
    state.currentUser = null;
    localStorage.removeItem('app_session_user');
    if (elements.mainPlayer) {
        elements.mainPlayer.pause();
    }
    elements.mainContent.classList.add('hidden');
    elements.loginScreen.classList.remove('hidden');
    elements.userIdInput.value = '';
    elements.userPwdInput.value = '';
    closeUserMenu();
    showToast("ログアウトしました", 'system');
}

function showLoginLoading(msg) {
    elements.loginBtnContainer.classList.add('hidden');
    elements.loadingArea.classList.remove('hidden');
    elements.loadingArea.classList.add('flex');
    elements.loadingMsg.textContent = msg;
    
    let dotCount = 0;
    state.loadingInterval = setInterval(() => {
        dotCount = (dotCount + 1) % 4;
        elements.loadingDots.textContent = '.'.repeat(dotCount);
    }, 300);
}

function hideLoginLoading() {
    if (state.loadingInterval) clearInterval(state.loadingInterval);
    elements.loadingArea.classList.add('hidden');
    elements.loadingArea.classList.remove('flex');
    elements.loginBtnContainer.classList.remove('hidden');
}

function showLoginError(msg) {
    elements.loginErrorMsg.textContent = msg;
    elements.loginError.classList.remove('hidden');
    elements.loginError.classList.add('flex');
}

function hideLoginError() {
    elements.loginError.classList.add('hidden');
    elements.loginError.classList.remove('flex');
}

function showMainInterface() {
    elements.loginScreen.classList.add('hidden');
    elements.mainContent.classList.remove('hidden');
    elements.mainContent.classList.add('flex');
    elements.headerUsername.textContent = state.currentUser || 'User';
    
    renderPlaylist();
    loadVideo(0);
    applyConfig();
    refreshLucideIcons();
}

// ==========================================
// 3. UIレンダリング (リンク/プレイリスト)
// ==========================================

function renderExternalLinks() {
    if (!elements.linksList) return;
    elements.linksList.innerHTML = EXTERNAL_LINKS.map(link => `
        <a href="${link.url}" target="_blank" rel="noopener noreferrer" 
           class="flex items-center gap-1.5 px-3 py-1.5 bg-brandBg hover:bg-brandSurface border border-brandBorder hover:border-brandAccent rounded-full text-xs text-brandMuted hover:text-brandText transition-all flex-shrink-0">
            <i data-lucide="${link.icon}" class="w-3.5 h-3.5 text-brandAccent"></i>
            <span class="font-bold">${link.title}</span>
        </a>
    `).join('');
}

function getFilteredAndSortedVideos() {
    let list = [...VIDEO_DATA];
    
    // 検索フィルタ
    if (state.searchQuery.trim() !== '') {
        const q = state.searchQuery.toLowerCase();
        list = list.filter(v => v.title.toLowerCase().includes(q) || v.desc.toLowerCase().includes(q));
    }
    
    // 並び替え
    if (state.sortOrder === 'newest') {
        list.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (state.sortOrder === 'oldest') {
        list.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (state.sortOrder === 'title') {
        list.sort((a, b) => a.title.localeCompare(b.title, 'ja'));
    }
    
    return list;
}

function renderPlaylist() {
    if (!elements.playlist) return;
    const filtered = getFilteredAndSortedVideos();
    
    if (filtered.length === 0) {
        elements.playlist.innerHTML = `
            <div class="p-8 text-center text-brandMuted border border-brandBorder rounded-2xl bg-brandSurface">
                <i data-lucide="search-x" class="w-8 h-8 mx-auto mb-2 text-brandMuted"></i>
                <p class="text-xs font-bold">該当する動画が見つかりません</p>
            </div>
        `;
        refreshLucideIcons();
        return;
    }
    
    elements.playlist.innerHTML = filtered.map((item) => {
        const originalIndex = VIDEO_DATA.findIndex(v => v.id === item.id);
        const isActive = originalIndex === state.currentVideoIndex;
        const isWatchLater = state.watchLater.includes(item.id);
        
        return `
            <div onclick="selectVideo(${originalIndex})" 
                 class="group relative flex gap-3 p-2.5 rounded-2xl border transition-all cursor-pointer ${
                     isActive 
                     ? 'bg-brandAccent/10 border-brandAccent text-brandText shadow-md' 
                     : 'bg-brandSurface hover:bg-brandBg border-brandBorder hover:border-brandMuted text-brandMuted hover:text-brandText'
                 }">
                <div class="relative w-28 h-16 sm:w-32 sm:h-20 rounded-xl overflow-hidden bg-black flex-shrink-0 border border-white/5">
                    <img src="${item.thumbnail}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                    ${item.type === 'image' 
                        ? `<span class="absolute top-1 right-1 bg-black/70 text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1"><i data-lucide="image" class="w-3 h-3"></i>GALLERY</span>`
                        : `<span class="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-mono px-1 py-0.5 rounded">VIDEO</span>`
                    }
                    ${isActive ? `<div class="absolute inset-0 bg-brandAccent/20 flex items-center justify-center"><i data-lucide="play" class="w-6 h-6 text-brandAccent fill-current"></i></div>` : ''}
                </div>
                
                <div class="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                        <h3 class="text-xs sm:text-sm font-bold line-clamp-2 leading-snug ${isActive ? 'text-brandAccent' : 'text-brandText'}">${item.title}</h3>
                        <p class="text-[10px] text-brandMuted mt-1">${item.date}</p>
                    </div>
                    
                    <div class="flex items-center justify-end gap-2 mt-1">
                        <button onclick="event.stopPropagation(); toggleWatchLaterById('${item.id}')" 
                                class="p-1 rounded-full hover:bg-brandSurface text-brandMuted hover:text-amber-400 transition-colors" title="あとで見る">
                            <i data-lucide="bookmark" class="w-4 h-4 ${isWatchLater ? 'text-amber-400 fill-amber-400' : ''}"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    refreshLucideIcons();
}

// ==========================================
// 4. メディアプレイヤー制御 (動画 / 画像)
// ==========================================

function loadVideo(index, checkResume = true) {
    if (index < 0 || index >= VIDEO_DATA.length) return;
    
    const media = VIDEO_DATA[index];
    state.currentVideoIndex = index;
    
    // UI更新
    elements.videoTitle.textContent = media.title;
    elements.videoDate.textContent = `公開日: ${media.date}`;
    elements.videoDesc.textContent = media.desc;
    
    updateWatchLaterIconState();
    
    // レジューム再生チェック
    const savedResume = state.resumePositions[media.id];
    if (checkResume && media.type === 'video' && savedResume && savedResume > 5) {
        state.pendingVideoIndex = index;
        state.resumePendingTime = savedResume;
        elements.resumeTimeText.textContent = `再生位置: ${formatTime(savedResume)}`;
        elements.resumeModal.classList.remove('hidden');
        elements.resumeModal.classList.add('flex');
        return;
    }
    
    if (media.type === 'image') {
        setupImageViewer(media);
    } else {
        setupVideoPlayer(media);
    }
    
    addToHistory(media.id);
    renderPlaylist();
}

function confirmResume(shouldResume) {
    elements.resumeModal.classList.add('hidden');
    elements.resumeModal.classList.remove('flex');
    
    const index = state.pendingVideoIndex;
    const media = VIDEO_DATA[index];
    
    setupVideoPlayer(media, shouldResume ? state.resumePendingTime : 0);
    addToHistory(media.id);
    renderPlaylist();
    
    if (shouldResume && state.notifications.resume) {
        showToast(`${formatTime(state.resumePendingTime)} から再生を開始しました`, 'resume');
    }
}

function setupVideoPlayer(media, startTime = 0) {
    elements.imageViewer.classList.add('hidden');
    elements.mainPlayer.classList.remove('hidden');
    elements.playerControls.classList.remove('hidden');
    
    elements.mainPlayer.pause();
    elements.playerSource.src = media.videoUrl;
    elements.mainPlayer.load();
    
    if (startTime > 0) {
        elements.mainPlayer.currentTime = startTime;
    }
    
    if (state.config.autoPlay) {
        elements.mainPlayer.play().then(() => {
            state.isPlaying = true;
            updatePlayBtnIcon();
        }).catch(() => {
            state.isPlaying = false;
            updatePlayBtnIcon();
        });
    }
}

function setupImageViewer(media) {
    elements.mainPlayer.pause();
    elements.mainPlayer.classList.add('hidden');
    elements.playerControls.classList.add('hidden');
    elements.imageViewer.classList.remove('hidden');
    elements.imageViewer.classList.add('flex');
    
    state.currentImageIndex = 0;
    const images = media.images || [media.thumbnail];
    
    elements.totalImgNum.textContent = images.length;
    elements.currentImgNum.textContent = 1;
    
    elements.imageTrack.innerHTML = images.map(imgSrc => `
        <div class="w-full h-full flex-shrink-0 flex items-center justify-center p-2">
            <img src="${imgSrc}" class="max-w-full max-h-full object-contain rounded-lg shadow-2xl">
        </div>
    `).join('');
    
    elements.imageIndicators.innerHTML = images.map((_, i) => `
        <div onclick="goToImage(${i})" class="w-2.5 h-2.5 rounded-full cursor-pointer transition-all ${i === 0 ? 'bg-brandAccent w-6' : 'bg-white/40 hover:bg-white/70'}"></div>
    `).join('');
    
    updateImageTrackPosition();
}

function updateImageTrackPosition() {
    elements.imageTrack.style.transform = `translateX(-${state.currentImageIndex * 100}%)`;
    elements.currentImgNum.textContent = state.currentImageIndex + 1;
    
    const dots = elements.imageIndicators.children;
    for (let i = 0; i < dots.length; i++) {
        if (i === state.currentImageIndex) {
            dots[i].className = "w-6 h-2.5 rounded-full cursor-pointer transition-all bg-brandAccent";
        } else {
            dots[i].className = "w-2.5 h-2.5 rounded-full cursor-pointer transition-all bg-white/40 hover:bg-white/70";
        }
    }
}

function prevImage(e) {
    if (e) e.stopPropagation();
    const media = VIDEO_DATA[state.currentVideoIndex];
    if (media.type !== 'image') return;
    if (state.currentImageIndex > 0) {
        state.currentImageIndex--;
        updateImageTrackPosition();
    }
}

function nextImage(e) {
    if (e) e.stopPropagation();
    const media = VIDEO_DATA[state.currentVideoIndex];
    if (media.type !== 'image') return;
    const images = media.images || [];
    if (state.currentImageIndex < images.length - 1) {
        state.currentImageIndex++;
        updateImageTrackPosition();
    }
}

function goToImage(index) {
    state.currentImageIndex = index;
    updateImageTrackPosition();
}

function setupPlayerEventListeners() {
    const player = elements.mainPlayer;
    if (!player) return;
    
    elements.playBtn.addEventListener('click', togglePlay);
    elements.muteBtn.addEventListener('click', toggleMute);
    
    player.addEventListener('play', () => {
        state.isPlaying = true;
        updatePlayBtnIcon();
    });
    
    player.addEventListener('pause', () => {
        state.isPlaying = false;
        updatePlayBtnIcon();
    });
    
    player.addEventListener('timeupdate', () => {
        if (!isNaN(player.duration)) {
            const pct = (player.currentTime / player.duration) * 100;
            elements.seekBar.value = pct;
            elements.currentTimeText.textContent = formatTime(player.currentTime);
            elements.durationText.textContent = formatTime(player.duration);
            
            // 進行状況の保存 (レジューム用)
            const media = VIDEO_DATA[state.currentVideoIndex];
            if (media && media.type === 'video') {
                state.resumePositions[media.id] = player.currentTime;
                localStorage.setItem('app_resume_positions', JSON.stringify(state.resumePositions));
            }
        }
    });
    
    elements.seekBar.addEventListener('input', () => {
        if (!isNaN(player.duration)) {
            const targetTime = (elements.seekBar.value / 100) * player.duration;
            player.currentTime = targetTime;
        }
    });
    
    elements.volumeBar.addEventListener('input', () => {
        const vol = elements.volumeBar.value / 100;
        player.volume = vol;
        player.muted = (vol === 0);
        elements.volumeLevel.textContent = `${Math.round(vol * 100)}%`;
        updateMuteBtnIcon();
    });
    
    player.addEventListener('waiting', () => {
        elements.videoSpinner.classList.remove('hidden');
    });
    
    player.addEventListener('playing', () => {
        elements.videoSpinner.classList.add('hidden');
    });
    
    elements.fullscreenBtn.addEventListener('click', toggleFullscreen);
}

function togglePlay() {
    const player = elements.mainPlayer;
    if (player.paused) {
        player.play();
    } else {
        player.pause();
    }
}

function updatePlayBtnIcon() {
    elements.playBtn.innerHTML = state.isPlaying 
        ? `<i data-lucide="pause" class="w-6 h-6 fill-current"></i>`
        : `<i data-lucide="play" class="w-6 h-6 fill-current"></i>`;
    refreshLucideIcons();
}

function toggleMute() {
    const player = elements.mainPlayer;
    player.muted = !player.muted;
    updateMuteBtnIcon();
}

function updateMuteBtnIcon() {
    const player = elements.mainPlayer;
    if (player.muted || player.volume === 0) {
        elements.muteBtn.innerHTML = `<i data-lucide="volume-x" class="w-5 h-5 text-red-400"></i>`;
    } else {
        elements.muteBtn.innerHTML = `<i data-lucide="volume-2" class="w-5 h-5"></i>`;
    }
    refreshLucideIcons();
}

function skipTime(seconds) {
    const player = elements.mainPlayer;
    if (!player || elements.mainPlayer.classList.contains('hidden')) return;
    player.currentTime = Math.max(0, Math.min(player.duration || 0, player.currentTime + seconds));
}

function toggleTheaterMode() {
    const grid = document.getElementById('mainLayoutGrid');
    const playerCol = document.getElementById('playerColumn');
    const sidebar = document.getElementById('sidebarArea');
    
    state.isTheaterMode = !state.isTheaterMode;
    
    if (state.isTheaterMode) {
        grid.classList.remove('max-w-6xl', 'grid-cols-1', 'lg:grid-cols-3');
        grid.classList.add('max-w-none', 'w-full', 'px-4');
        playerCol.classList.remove('lg:col-span-2');
        sidebar.classList.add('hidden');
        showToast("大画面モードに切替えました", "system");
    } else {
        grid.classList.add('max-w-6xl', 'grid-cols-1', 'lg:grid-cols-3');
        grid.classList.remove('max-w-none', 'px-4');
        playerCol.classList.add('lg:col-span-2');
        sidebar.classList.remove('hidden');
    }
}

function togglePiP() {
    if (document.pictureInPictureElement) {
        document.exitPictureInPicture();
    } else if (elements.mainPlayer && elements.mainPlayer.requestPictureInPicture) {
        elements.mainPlayer.requestPictureInPicture().catch(() => {
            showToast("ピクチャーインピクチャーに対応していません", "system");
        });
    }
}

function toggleFullscreen() {
    const container = elements.videoContainer;
    if (!document.fullscreenElement) {
        if (container.requestFullscreen) {
            container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
            container.webkitRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// ==========================================
// 5. タッチジェスチャー (ダブルタップスキップ)
// ==========================================

function setupGestureListeners() {
    let lastTapLeft = 0;
    let lastTapRight = 0;
    
    elements.leftTapZone.addEventListener('click', (e) => {
        const now = Date.now();
        if (now - lastTapLeft < 300) {
            skipTime(-10);
            triggerRipple(elements.leftRipple);
        }
        lastTapLeft = now;
    });
    
    elements.rightTapZone.addEventListener('click', (e) => {
        const now = Date.now();
        if (now - lastTapRight < 300) {
            skipTime(10);
            triggerRipple(elements.rightRipple);
        }
        lastTapRight = now;
    });
}

function triggerRipple(rippleElem) {
    rippleElem.classList.remove('hidden');
    rippleElem.classList.add('flex');
    setTimeout(() => {
        rippleElem.classList.add('hidden');
        rippleElem.classList.remove('flex');
    }, 600);
}

// ==========================================
// 6. 検索・並び替え処理
// ==========================================

function handleSearch() {
    state.searchQuery = elements.searchInput.value;
    if (state.searchQuery.trim() !== '') {
        elements.searchClearBtn.classList.remove('hidden');
    } else {
        elements.searchClearBtn.classList.add('hidden');
    }
    renderPlaylist();
}

function clearSearch() {
    elements.searchInput.value = '';
    state.searchQuery = '';
    elements.searchClearBtn.classList.add('hidden');
    renderPlaylist();
}

function setupSortMenu() {
    const options = [
        { label: "新しい順", val: "newest" },
        { label: "古い順", val: "oldest" },
        { label: "タイトル順", val: "title" }
    ];
    
    elements.sortDropdownList.innerHTML = options.map(opt => `
        <button onclick="selectSort('${opt.val}', '${opt.label}')" class="w-full text-left px-3 py-2 text-xs font-bold text-brandText hover:bg-brandBg transition-colors flex items-center justify-between">
            <span>${opt.label}</span>
            ${state.sortOrder === opt.val ? '<i data-lucide="check" class="w-3.5 h-3.5 text-brandAccent"></i>' : ''}
        </button>
    `).join('');
}

function toggleSortDropdown(e) {
    e.stopPropagation();
    elements.sortDropdown.classList.toggle('hidden');
}

function selectSort(order, label) {
    state.sortOrder = order;
    elements.sortLabel.textContent = label;
    elements.sortDropdown.classList.add('hidden');
    setupSortMenu();
    renderPlaylist();
    refreshLucideIcons();
}

document.addEventListener('click', () => {
    if (elements.sortDropdown) elements.sortDropdown.classList.add('hidden');
    closeUserMenu();
});

// ==========================================
// 7. モーダル & ユーザーメニュー処理
// ==========================================

function toggleUserMenu(e) {
    if (e) e.stopPropagation();
    elements.userMenuDropdown.classList.toggle('hidden');
}

function closeUserMenu() {
    if (elements.userMenuDropdown) elements.userMenuDropdown.classList.add('hidden');
}

function openSettings() {
    elements.settingsModal.classList.remove('hidden', 'opacity-0');
    elements.settingsModal.classList.add('opacity-100');
    document.getElementById('config-playbackRate').value = state.config.playbackRate;
    document.getElementById('config-autoPlay').checked = state.config.autoPlay;
}

function closeSettings() {
    elements.settingsModal.classList.add('opacity-0');
    setTimeout(() => {
        elements.settingsModal.classList.add('hidden');
    }, 300);
}

function updateAppConfig(key, value) {
    state.config[key] = value;
    localStorage.setItem('app_config', JSON.stringify(state.config));
    applyConfig();
    
    if (key === 'playbackRate' && state.notifications.playbackRate) {
        showToast(`再生速度を ${value}x に設定しました`, 'playbackRate');
    }
}

function applyConfig() {
    if (elements.mainPlayer) {
        elements.mainPlayer.playbackRate = state.config.playbackRate;
    }
}

// 履歴管理
function addToHistory(videoId) {
    state.history = state.history.filter(id => id !== videoId);
    state.history.unshift(videoId);
    if (state.history.length > 30) state.history.pop();
    localStorage.setItem('app_history', JSON.stringify(state.history));
}

function openHistoryModal() {
    elements.historyModal.classList.remove('hidden');
    renderHistoryList();
}

function closeHistoryModal() {
    elements.historyModal.classList.add('hidden');
}

function renderHistoryList() {
    if (state.history.length === 0) {
        elements.historyListContainer.innerHTML = `<p class="text-xs text-brandMuted text-center py-6">視聴履歴はありません</p>`;
        return;
    }
    
    elements.historyListContainer.innerHTML = state.history.map(id => {
        const media = VIDEO_DATA.find(v => v.id === id);
        if (!media) return '';
        return `
            <div onclick="selectVideoById('${media.id}'); closeHistoryModal();" class="flex items-center gap-3 p-2 bg-brandBg hover:bg-brandSurface rounded-xl border border-brandBorder cursor-pointer transition">
                <img src="${media.thumbnail}" class="w-16 h-10 object-cover rounded-lg flex-shrink-0">
                <div class="min-w-0 flex-1">
                    <p class="text-xs font-bold text-brandText truncate">${media.title}</p>
                    <p class="text-[10px] text-brandMuted">${media.date}</p>
                </div>
            </div>
        `;
    }).join('');
}

function clearHistory() {
    state.history = [];
    localStorage.removeItem('app_history');
    renderHistoryList();
    if (state.notifications.historyClear) {
        showToast("視聴履歴を削除しました", "historyClear");
    }
}

// あとで見る管理
function toggleWatchLater() {
    const currentMedia = VIDEO_DATA[state.currentVideoIndex];
    if (!currentMedia) return;
    toggleWatchLaterById(currentMedia.id);
}

function toggleWatchLaterById(id) {
    const index = state.watchLater.indexOf(id);
    let added = false;
    if (index > -1) {
        state.watchLater.splice(index, 1);
    } else {
        state.watchLater.push(id);
        added = true;
    }
    localStorage.setItem('app_watch_later', JSON.stringify(state.watchLater));
    updateWatchLaterIconState();
    renderPlaylist();
    
    if (state.notifications.watchLater) {
        showToast(added ? "「あとで見る」に追加しました" : "「あとで見る」から削除しました", "watchLater");
    }
}

function updateWatchLaterIconState() {
    const currentMedia = VIDEO_DATA[state.currentVideoIndex];
    if (!currentMedia || !elements.watchLaterIcon) return;
    const isWatchLater = state.watchLater.includes(currentMedia.id);
    if (isWatchLater) {
        elements.watchLaterIcon.classList.add('fill-amber-400');
    } else {
        elements.watchLaterIcon.classList.remove('fill-amber-400');
    }
}

function openWatchLaterModal() {
    elements.watchLaterModal.classList.remove('hidden');
    renderWatchLaterList();
}

function closeWatchLaterModal() {
    elements.watchLaterModal.classList.add('hidden');
}

function renderWatchLaterList() {
    if (state.watchLater.length === 0) {
        elements.watchLaterListContainer.innerHTML = `<p class="text-xs text-brandMuted text-center py-6">「あとで見る」リストは空です</p>`;
        return;
    }
    
    elements.watchLaterListContainer.innerHTML = state.watchLater.map(id => {
        const media = VIDEO_DATA.find(v => v.id === id);
        if (!media) return '';
        return `
            <div onclick="selectVideoById('${media.id}'); closeWatchLaterModal();" class="flex items-center justify-between p-2 bg-brandBg hover:bg-brandSurface rounded-xl border border-brandBorder cursor-pointer transition">
                <div class="flex items-center gap-3 min-w-0">
                    <img src="${media.thumbnail}" class="w-16 h-10 object-cover rounded-lg flex-shrink-0">
                    <div class="min-w-0">
                        <p class="text-xs font-bold text-brandText truncate">${media.title}</p>
                        <p class="text-[10px] text-brandMuted">${media.date}</p>
                    </div>
                </div>
                <button onclick="event.stopPropagation(); toggleWatchLaterById('${media.id}'); renderWatchLaterList();" class="p-2 text-brandMuted hover:text-red-400">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </div>
        `;
    }).join('');
    refreshLucideIcons();
}

// 通知設定モーダル
function openNotificationSettingsModal() {
    elements.notificationSettingsModal.classList.remove('hidden');
    elements.notificationSettingsModal.classList.add('flex');
    
    // スイッチの状態を同期
    Object.keys(state.notifications).forEach(key => {
        const chk = document.getElementById(`notif-${key}`);
        if (chk) chk.checked = state.notifications[key];
    });
}

function closeNotificationSettingsModal() {
    elements.notificationSettingsModal.classList.add('hidden');
    elements.notificationSettingsModal.classList.remove('flex');
}

function updateNotificationCategory(key, enabled) {
    state.notifications[key] = enabled;
    localStorage.setItem('app_notifications', JSON.stringify(state.notifications));
}

function setAllNotifications(enabled) {
    Object.keys(state.notifications).forEach(key => {
        state.notifications[key] = enabled;
        const chk = document.getElementById(`notif-${key}`);
        if (chk) chk.checked = enabled;
    });
    localStorage.setItem('app_notifications', JSON.stringify(state.notifications));
    showToast(enabled ? "すべての通知をONにしました" : "すべての通知をOFFにしました", "system");
}

function filterNotificationItems() {
    const q = document.getElementById('notifSearchInput').value.toLowerCase();
    const items = document.querySelectorAll('.notif-item');
    let hasMatch = false;
    
    items.forEach(item => {
        const title = item.getAttribute('data-title').toLowerCase();
        const desc = item.getAttribute('data-desc').toLowerCase();
        if (title.includes(q) || desc.includes(q)) {
            item.classList.remove('hidden');
            hasMatch = true;
        } else {
            item.classList.add('hidden');
        }
    });
    
    const noMatch = document.getElementById('noNotifMatchMsg');
    if (hasMatch) {
        noMatch.classList.add('hidden');
    } else {
        noMatch.classList.remove('hidden');
    }
}

function clearNotifSearch() {
    document.getElementById('notifSearchInput').value = '';
    filterNotificationItems();
}

// ショートカットキーモーダル
function showShortcutsModal() {
    elements.shortcutsModal.classList.remove('hidden');
    elements.shortcutsModal.classList.add('flex');
}

function closeShortcutsModal() {
    elements.shortcutsModal.classList.add('hidden');
    elements.shortcutsModal.classList.remove('flex');
}

// ダウンロード・共有
function shareVideo() {
    const media = VIDEO_DATA[state.currentVideoIndex];
    if (navigator.share) {
        navigator.share({
            title: media.title,
            text: media.desc,
            url: window.location.href
        }).catch(() => {});
    } else {
        navigator.clipboard.writeText(window.location.href);
        if (state.notifications.share) {
            showToast("ページURLをクリップボードにコピーしました", "share");
        }
    }
}

function downloadMedia() {
    const media = VIDEO_DATA[state.currentVideoIndex];
    elements.iphoneDirectLink.href = media.downloadUrl || media.videoUrl || media.thumbnail;
    elements.androidDirectLink.href = media.downloadUrl || media.videoUrl || media.thumbnail;
    elements.downloadModal.classList.remove('hidden');
    elements.downloadModal.classList.add('flex');
}

function closeModal() {
    elements.downloadModal.classList.add('hidden');
    elements.downloadModal.classList.remove('flex');
}

// ==========================================
// 8. ユーティリティ・キーボードショートカット
// ==========================================

function selectVideo(index) {
    loadVideo(index);
}

function selectVideoById(id) {
    const index = VIDEO_DATA.findIndex(v => v.id === id);
    if (index > -1) {
        selectVideo(index);
    }
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function showToast(message, category = 'system') {
    // カテゴリごとの通知設定チェック
    if (category && state.notifications[category] === false) {
        return;
    }
    
    elements.toastMsg.textContent = message;
    elements.toast.classList.remove('translate-y-10', 'opacity-0');
    elements.toast.classList.add('translate-y-0', 'opacity-100');
    
    if (state.toastTimeout) clearTimeout(state.toastTimeout);
    state.toastTimeout = setTimeout(() => {
        elements.toast.classList.remove('translate-y-0', 'opacity-100');
        elements.toast.classList.add('translate-y-10', 'opacity-0');
    }, 2500);
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // 入力フィールドフォーカス時はスキップ
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
        
        const media = VIDEO_DATA[state.currentVideoIndex];
        
        switch (e.code) {
            case 'Space':
            case 'KeyK':
                e.preventDefault();
                if (media.type === 'video') togglePlay();
                break;
            case 'KeyF':
                e.preventDefault();
                toggleFullscreen();
                break;
            case 'KeyT':
                e.preventDefault();
                toggleTheaterMode();
                break;
            case 'KeyM':
                e.preventDefault();
                if (media.type === 'video') toggleMute();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                if (media.type === 'video') skipTime(-5);
                else prevImage();
                break;
            case 'ArrowRight':
                e.preventDefault();
                if (media.type === 'video') skipTime(5);
                else nextImage();
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (elements.volumeBar && media.type === 'video') {
                    elements.volumeBar.value = Math.min(100, parseInt(elements.volumeBar.value) + 5);
                    elements.volumeBar.dispatchEvent(new Event('input'));
                }
                break;
            case 'ArrowDown':
                e.preventDefault();
                if (elements.volumeBar && media.type === 'video') {
                    elements.volumeBar.value = Math.max(0, parseInt(elements.volumeBar.value) - 5);
                    elements.volumeBar.dispatchEvent(new Event('input'));
                }
                break;
        }
    });
}
