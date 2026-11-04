const APP_LAYOUT_HTML = String.raw`
        <div id="loginScreen" class="min-h-screen flex items-center justify-center p-6 bg-brandBg flex-col z-50 relative">
        <div class="w-full max-w-sm bg-brandSurface p-8 sm:p-10 rounded-theme border border-brandBorder theme-shadow relative overflow-hidden transition-all duration-300">
            
            <h2 class="text-5xl text-brandAccent mb-8 sm:mb-10 flex justify-center tracking-[0.1em]">
                <span style="font-family: 'Bebas Neue', sans-serif; transform: scaleY(1.15); transform-origin: bottom;">LOGIN</span>
            </h2>
            
            <form id="loginForm" onsubmit="event.preventDefault(); if (typeof handleLogin === 'function') { handleLogin(event); } else { document.getElementById('loginError').classList.remove('hidden'); document.getElementById('loginError').classList.add('flex'); document.getElementById('loginErrorMsg').textContent = '読み込み中です。数秒待ってからもう一度お試しください'; } return false;" class="space-y-6 sm:space-y-8">
                <div class="relative">
                    <input type="text" id="userId" required placeholder=" " class="floating-input w-full bg-transparent border-b border-brandBorder py-2.5 text-brandText focus:border-brandAccent outline-none transition-all text-base">
                    <label class="floating-label absolute left-0 top-2.5 text-brandMuted pointer-events-none text-sm">Username</label>
                </div>
                <div class="relative">
                    <input type="password" id="userPwd" required placeholder=" " class="floating-input w-full bg-transparent border-b border-brandBorder py-2.5 text-brandText focus:border-brandAccent outline-none transition-all text-base">
                    <label class="floating-label absolute left-0 top-2.5 text-brandMuted pointer-events-none text-sm">Password</label>
                </div>
                
                                <div class="pt-2 flex flex-col gap-3.5" id="loginBtnContainer">
                    <button type="submit" class="w-full bg-brandAccent hover:bg-brandAccentHover text-white h-12 rounded-full font-bold transition-all shadow-lg uppercase tracking-widest text-sm active:scale-95 flex items-center justify-center">
                        Sign in
                    </button>

                                        <button type="button" onclick="if (typeof loginWithDiscord === 'function') { loginWithDiscord(); } else { document.getElementById('loginError').classList.remove('hidden'); document.getElementById('loginError').classList.add('flex'); document.getElementById('loginErrorMsg').textContent = '読み込み中です。数秒待ってからもう一度お試しください'; }" class="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white h-12 px-4 rounded-full font-bold transition-all shadow-lg flex items-center justify-center gap-2.5 text-sm active:scale-95">
                        <svg class="w-5 h-5 fill-current flex-shrink-0" viewBox="0 0 127.14 96.36">
                            <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,45.91,53.87,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,45.91,96.11,53,91.08,65.69,84.69,65.69Z"/>
                        </svg>
                        <span>Discordでログイン</span>
                    </button>
                </div>
            </form>

            <div id="loadingArea" class="hidden flex-col items-center justify-center mt-6 pt-4">
                <div class="gauge mb-4"><div class="gauge-bar"></div></div>
                                <div id="loadingTextContainer" class="flex items-center justify-center text-brandAccent text-xs font-bold tracking-wide font-mono h-6 text-center w-full">
                    <span id="loadingMsg">サーバー状況を確認しています</span>
                    <span id="loadingDots" class="w-4 text-left inline-block"></span>
                </div>
            </div>

            <div id="loginError" class="hidden items-center justify-center gap-2 text-red-500 bg-red-950/30 border border-red-900 py-3 px-4 rounded-xl mt-6">
                <i data-lucide="alert-circle" class="w-5 h-5 flex-shrink-0"></i>
                <span id="loginErrorMsg" class="text-xs font-bold tracking-normal leading-relaxed break-all">認証に失敗しました</span>
            </div>
        </div>
    </div>

        <div id="mainContent" class="hidden flex-col w-full min-h-screen">
        
        <header id="mainHeader" class="w-full bg-brandHeader border-b border-brandBorder py-3 px-3 sm:px-6 md:px-10 flex items-center justify-between gap-3 shadow-md z-40 transition-all duration-500 select-none">
            
            <div class="flex items-center flex-shrink-0">
                <button onclick="openSettings()" class="p-2.5 text-brandMuted hover:text-brandAccent hover:bg-brandSurface rounded-full transition-all active:scale-90 min-w-[44px] min-h-[44px] flex items-center justify-center" title="UI・プレイヤー設定">
                    <i data-lucide="settings" class="w-6 h-6"></i>
                </button>
            </div>

            <div class="flex-1 min-w-0 overflow-x-auto no-scrollbar py-1" id="externalLinksContainer">
                <div class="flex items-center gap-2.5" id="linksList"></div>
            </div>
            
            <div class="flex items-center gap-3 flex-shrink-0">
                <div class="text-right hidden sm:block">
                    <p class="text-[10px] text-brandMuted">Welcome,</p>
                    <p id="headerUsername" class="text-xs font-bold text-brandAccent tracking-wide">User</p>
                </div>

                                <div class="relative">
                    <div id="userMenuBtn" onclick="toggleUserMenu(event)" class="cursor-pointer w-10 h-10 rounded-full bg-brandSurface border border-brandBorder flex items-center justify-center text-brandMuted shadow-inner overflow-hidden hover:border-brandAccent transition-colors">
                        <i data-lucide="user" class="w-5 h-5 sm:w-6 sm:h-6 pointer-events-none"></i>
                    </div>
                    
                    <div id="userMenuDropdown" class="hidden absolute right-0 top-full mt-3 w-48 bg-brandSurface border border-brandBorder rounded-xl shadow-2xl py-2 z-50 origin-top-right">
                        <a href="javascript:void(0)" onclick="closeUserMenu(); openMyPage();" class="block px-4 py-3 text-xs font-bold text-brandText hover:bg-brandBg transition-colors flex items-center gap-2.5"><i data-lucide="layout-dashboard" class="w-4 h-4 text-brandMuted"></i> マイページ</a>
                        <a href="javascript:void(0)" onclick="closeUserMenu(); openHistoryModal();" class="block px-4 py-3 text-xs font-bold text-brandText hover:bg-brandBg transition-colors flex items-center gap-2.5"><i data-lucide="history" class="w-4 h-4 text-brandMuted"></i> 視聴履歴</a>
                        <a href="javascript:void(0)" onclick="closeUserMenu(); openFavoritesModal();" class="block px-4 py-3 text-xs font-bold text-brandText hover:bg-brandBg transition-colors flex items-center gap-2.5"><i data-lucide="heart" class="w-4 h-4 text-brandMuted"></i> お気に入り</a>
                        <a href="javascript:void(0)" onclick="closeUserMenu(); openSavesModal();" class="block px-4 py-3 text-xs font-bold text-brandText hover:bg-brandBg transition-colors flex items-center gap-2.5"><i data-lucide="bookmark" class="w-4 h-4 text-brandMuted"></i> あとで見る</a>
                        <a href="javascript:void(0)" onclick="closeUserMenu(); openNotificationSettingsModal();" class="block px-4 py-3 text-xs font-bold text-brandText hover:bg-brandBg transition-colors flex items-center gap-2.5"><i data-lucide="bell" class="w-4 h-4 text-brandMuted"></i> 通知設定</a>
                        <a href="javascript:void(0)" onclick="closeUserMenu(); showShortcutsModal();" class="block px-4 py-3 text-xs font-bold text-brandText hover:bg-brandBg transition-colors flex items-center gap-2.5"><i data-lucide="keyboard" class="w-4 h-4 text-brandMuted"></i> ショートカット</a>
                        
                        <hr class="border-brandBorder my-2 opacity-50">
                        
                        <button onclick="logout()" class="w-full text-left px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-950/30 transition-colors flex items-center gap-2.5"><i data-lucide="log-out" class="w-4 h-4"></i> ログアウト</button>
                    </div>
                </div>
            </div>
        </header>

                <div id="mainLayoutGrid" class="max-w-6xl w-full mx-auto p-3 sm:p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 flex-grow mt-2 sm:mt-4 transition-all duration-300">
            
                        <div id="playerColumn" class="lg:col-span-2 space-y-5 sm:space-y-6 transition-all duration-300">
                <div id="videoContainer" class="relative w-full aspect-video bg-black rounded-theme overflow-hidden shadow-2xl border border-brandBorder group transition-all duration-300">
                    
                                        <video id="mainPlayer" class="w-full h-full object-contain" playsinline>
                        <source id="playerSource" src="" type="video/mp4">
                    </video>

                                        <div id="imageViewer" class="absolute inset-0 z-[25] hidden bg-black flex-col overflow-hidden">
                                                <div id="imageTrack" class="flex w-full h-full transition-transform duration-300 ease-out touch-pan-y">
                                                    </div>
                        
                                                <button id="prevImgBtn" onclick="prevImage(event)" class="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0 z-30 shadow-lg">
                            <i data-lucide="chevron-left" class="w-5 h-5 sm:w-6 sm:h-6"></i>
                        </button>
                        <button id="nextImgBtn" onclick="nextImage(event)" class="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0 z-30 shadow-lg">
                            <i data-lucide="chevron-right" class="w-5 h-5 sm:w-6 sm:h-6"></i>
                        </button>
                        
                                                <div id="imageIndicators" class="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-30"></div>
                        
                                                <div class="absolute top-4 right-4 bg-black/60 backdrop-blur text-white text-xs font-mono px-3 py-1.5 rounded-full z-30 shadow-lg border border-white/10">
                            <span id="currentImgNum">1</span> / <span id="totalImgNum">1</span>
                        </div>
                    </div>

                                        <div id="touchGestureOverlay" class="absolute inset-0 z-20 flex pointer-events-auto">
                        <div id="leftTapZone" class="w-1/2 h-full relative flex items-center justify-center">
                            <div id="leftRipple" class="hidden flex-col items-center justify-center bg-white/20 rounded-full w-24 h-24 p-2 text-white double-tap-ripple pointer-events-none">
                                <i data-lucide="rotate-ccw" class="w-8 h-8"></i>
                                <span id="leftRippleText" class="text-[11px] font-bold mt-1">10秒戻る</span>
                            </div>
                        </div>
                        <div id="rightTapZone" class="w-1/2 h-full relative flex items-center justify-center">
                            <div id="rightRipple" class="hidden flex-col items-center justify-center bg-white/20 rounded-full w-24 h-24 p-2 text-white double-tap-ripple pointer-events-none">
                                <i data-lucide="rotate-cw" class="w-8 h-8"></i>
                                <span id="rightRippleText" class="text-[11px] font-bold mt-1">10秒進む</span>
                            </div>
                        </div>
                    </div>
                    
                                        <div id="playerControls" class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent p-3 sm:p-5 transition-opacity duration-300 flex flex-col gap-2.5 sm:gap-3 z-30 opacity-100">
                        <div class="flex items-center gap-2 sm:gap-3">
                            <span id="currentTime" class="text-xs text-brandMuted font-mono w-10 text-right select-none">00:00</span>
                            <input type="range" id="seekBar" class="w-full" value="0" max="100">
                            <span id="duration" class="text-xs text-brandMuted font-mono w-10 select-none">00:00</span>
                        </div>
                        
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2 sm:gap-4">
                                <button id="skipBackBtn" onclick="skipTime(-appConfig.doubleTapSeek)" class="p-2 text-white hover:text-brandAccent transition-colors active:scale-90 min-w-[40px] min-h-[40px] flex items-center justify-center" title="10秒戻る">
                                    <i data-lucide="rotate-ccw" class="w-5 h-5"></i>
                                </button>
                                
                                <button id="playBtn" class="p-2 text-white hover:text-brandAccent transition-colors active:scale-90 min-w-[40px] min-h-[40px] flex items-center justify-center">
                                    <i data-lucide="play" class="w-6 h-6 fill-current"></i>
                                </button>

                                <button id="skipForwardBtn" onclick="skipTime(appConfig.doubleTapSeek)" class="p-2 text-white hover:text-brandAccent transition-colors active:scale-90 min-w-[40px] min-h-[40px] flex items-center justify-center" title="10秒進む">
                                    <i data-lucide="rotate-cw" class="w-5 h-5"></i>
                                </button>

                                <div class="flex items-center gap-1.5 ml-1 sm:ml-2">
                                    <button id="muteBtn" class="p-2 text-white hover:text-brandMuted transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center">
                                        <i data-lucide="volume-2" class="w-5 h-5"></i>
                                    </button>
                                    <input type="range" id="volumeBar" class="w-14 sm:w-24 transition-all" value="100" max="100">
                                    <span id="volumeLevel" class="hidden sm:inline-block text-[10px] text-brandMuted font-mono w-8 text-left select-none">100%</span>
                                </div>
                            </div>

                            <div class="flex items-center gap-1.5 sm:gap-4">
                                <button id="theaterBtn" onclick="toggleTheaterMode()" class="p-2 text-white hover:text-brandAccent transition-colors hidden sm:flex items-center justify-center min-w-[40px] min-h-[40px]" title="大画面モード切替 (T)">
                                    <i data-lucide="rectangle-horizontal" class="w-5 h-5"></i>
                                </button>
                                <button id="pipBtn" onclick="togglePiP()" class="p-2 text-white hover:text-brandAccent transition-colors hidden sm:flex items-center justify-center min-w-[40px] min-h-[40px]" title="ピクチャーインピクチャー">
                                    <i data-lucide="picture-in-picture-2" class="w-5 h-5"></i>
                                </button>
                                <button id="fullscreenBtn" class="p-2 text-white hover:text-brandAccent transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center active:scale-90" title="全画面 (F)">
                                    <i data-lucide="maximize" class="w-5 h-5"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div id="videoSpinner" class="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none hidden z-20">
                        <div class="login-spinner rounded-full h-12 w-12 border-4 border-brandAccent border-t-transparent"></div>
                    </div>
                </div>

                                <div id="videoInfoBox" class="bg-brandSurface p-4 sm:p-6 rounded-theme border border-brandBorder space-y-4 shadow-xl transition-all duration-500">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div class="space-y-1">
                            <h1 id="videoTitle" class="text-lg sm:text-xl lg:text-2xl font-black tracking-tight leading-tight text-brandText">読み込み中...</h1>
                            <p class="text-xs text-brandMuted" id="videoDate">公開日: ----/--/--</p>
                        </div>
                        <div class="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                            <button id="favoriteBtn" onclick="toggleFavorite()" title="お気に入り" class="p-3 bg-brandBg border border-brandBorder hover:border-rose-400 active:scale-95 transition-all rounded-full text-brandText shadow-md flex items-center justify-center min-w-[44px] min-h-[44px]">
                                <i data-lucide="heart" class="w-5 h-5 text-rose-400 fill-transparent"></i>
                            </button>
                            <button id="saveBtn" onclick="toggleSave()" title="あとで見る" class="p-3 bg-brandBg border border-brandBorder hover:border-amber-400 active:scale-95 transition-all rounded-full text-brandText shadow-md flex items-center justify-center min-w-[44px] min-h-[44px]">
                                <i data-lucide="bookmark" class="w-5 h-5 text-amber-400 fill-transparent"></i>
                            </button>
                            <button onclick="shareVideo()" class="flex items-center gap-1.5 px-4 py-3 bg-brandBg border border-brandBorder hover:border-brandAccent active:scale-95 transition-all rounded-full text-xs font-bold text-brandText shadow-md min-h-[44px]">
                                <i data-lucide="share-2" class="w-4 h-4 text-blue-400"></i><span>共有する</span>
                            </button>
                            <button id="downloadBtn" onclick="downloadMedia()" class="flex items-center gap-1.5 px-4 py-3 bg-brandBg border border-brandBorder hover:border-brandAccent active:scale-95 transition-all rounded-full text-xs font-bold text-brandText shadow-md min-h-[44px]">
                                <i data-lucide="download" class="w-4 h-4 text-green-400"></i><span id="downloadBtnText">ダウンロード</span>
                            </button>
                        </div>
                    </div>
                    <div class="p-4 bg-brandBg rounded-2xl text-sm leading-relaxed border border-brandBorder">
                        <p id="videoDesc" class="whitespace-pre-line text-xs lg:text-sm text-brandMuted select-text">動画情報をロード中...</p>
                    </div>
                </div>
            </div>

                        <aside id="sidebarArea" class="space-y-4 transition-all duration-500">
                <div class="flex items-center justify-between px-1">
                    <h2 class="text-xs font-black text-brandMuted flex items-center gap-2 tracking-wider uppercase">
                        <i data-lucide="play-circle" class="w-4 h-4 text-brandAccent animate-pulse"></i>
                        <span>プレイリスト</span>
                    </h2>
                    
                    <div class="flex items-center gap-2">
                        <button id="addVideoBtn" onclick="openAddVideoModal()" class="hidden text-[11px] text-brandAccent hover:text-brandText bg-brandSurface px-3 py-2 rounded-xl border border-brandBorder transition-colors flex items-center gap-1.5 font-bold active:scale-95">
                            <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                            <span>追加</span>
                        </button>
                        <button id="randomBtn" onclick="playRandom()" title="ランダム再生" class="text-[11px] text-brandMuted hover:text-brandText bg-brandSurface px-3 py-2 rounded-xl border border-brandBorder transition-colors flex items-center gap-1.5 font-bold active:scale-95">
                            <i data-lucide="shuffle" class="w-3.5 h-3.5"></i>
                            <span>ランダム</span>
                        </button>
                        <div class="relative">
                            <button onclick="toggleSortDropdown(event)" id="sortBtn" class="text-[11px] text-brandMuted hover:text-brandText bg-brandSurface px-3 py-2 rounded-xl border border-brandBorder transition-colors flex items-center gap-1.5 font-bold active:scale-95">
                                <i data-lucide="arrow-down-up" class="w-3.5 h-3.5"></i>
                                <span id="sortLabel">新しい順</span>
                                <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-brandMuted"></i>
                            </button>

                            <div id="sortDropdown" class="hidden absolute right-0 top-full mt-2 w-32 bg-brandSurface border border-brandBorder rounded-xl shadow-2xl py-1 z-50 origin-top-right overflow-hidden">
                                <div id="sortDropdownList" class="flex flex-col"></div>
                            </div>
                        </div>
                    </div>
                </div>

                                <div class="relative flex items-center">
                    <i data-lucide="search" class="w-4 h-4 text-brandMuted absolute left-3.5 pointer-events-none"></i>
                    <input type="text" id="searchInput" oninput="handleSearch()" placeholder="タイトル・ハッシュタグで検索..." 
                           class="w-full bg-brandSurface border border-brandBorder rounded-xl pl-10 pr-9 py-2.5 text-xs text-brandText placeholder-brandMuted focus:border-brandAccent focus:outline-none transition-colors">
                    <button id="searchClearBtn" onclick="clearSearch()" class="hidden absolute right-3 text-brandMuted hover:text-brandText transition-colors p-1">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </button>
                </div>

                <div id="playlist" class="space-y-3"></div>
            </aside>
        </div>

        <footer id="mainFooter" class="bg-brandHeader border-t border-brandBorder py-6 mt-8 transition-all duration-500">
            <div class="max-w-7xl mx-auto px-4 text-center space-y-1">
                <p class="text-xs text-brandMuted">© 2026 GVN Organization - <a href="https://minecraft-jp.github.io/GVN-Organization/" target="_blank" class="gradient underline font-bold hover:opacity-80 transition-opacity">GVN ORG</a></p>
            </div>
        </footer>
    </div>

        <div id="settingsModal" class="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 hidden opacity-0 transition-opacity duration-300">
        <div id="settingsModalScaleWrapper" class="transform scale-95 transition-transform duration-300 w-full max-w-lg">
        <div class="bg-brandSurface border border-brandBorder rounded-theme w-full max-h-[90vh] p-6 shadow-2xl relative overflow-y-auto scrollbar-thin" id="settingsModalContent">
            
            <button onclick="closeSettings()" class="absolute top-4 right-4 text-brandMuted hover:text-brandAccent transition active:scale-90 bg-brandBg p-2 rounded-full border border-brandBorder">
                <i data-lucide="x" class="w-5 h-5"></i>
            </button>
            
            <h2 class="text-xl font-black text-brandAccent mb-6 flex items-center gap-2 tracking-widest border-b border-brandBorder pb-3">
                <i data-lucide="sliders" class="w-5 h-5"></i> SETTINGS
            </h2>
            
            <h3 class="text-sm font-bold text-brandText mb-4 flex items-center gap-2 bg-brandBg py-2 px-3 rounded-lg border border-brandBorder">
                <i data-lucide="play-square" class="w-4 h-4 text-brandAccent"></i> 動作設定 (Player)
            </h3>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <label class="block">
                    <span class="text-xs text-brandMuted block mb-1 font-bold">再生速度</span>
                    <select id="config-playbackRate" class="w-full h-11 px-3 rounded bg-brandBg text-brandText border border-brandBorder outline-none font-bold text-sm" onchange="updateAppConfig('playbackRate', parseFloat(this.value))">
                        <option value="0.5">0.5x (スロー)</option>
                        <option value="1.0">1.0x (標準)</option>
                        <option value="1.25">1.25x (少し速い)</option>
                        <option value="1.5">1.5x (速い)</option>
                        <option value="2.0">2.0x (超速)</option>
                    </select>
                </label>

                <label class="block">
                    <span class="text-xs text-brandMuted block mb-1 font-bold">デフォルト音量 (<span id="volumeValueLabel">100</span>%)</span>
                    <input type="range" id="config-defaultVolume" min="0" max="100" step="5" class="w-full h-11 accent-brandAccent" oninput="document.getElementById('volumeValueLabel').textContent = this.value" onchange="updateAppConfig('defaultVolume', parseInt(this.value))">
                </label>

                <div class="flex items-center justify-between p-3 border border-brandBorder rounded bg-brandBg h-11">
                    <span class="text-xs font-bold text-brandText">自動再生 (選択時)</span>
                    <label class="flex items-center cursor-pointer">
                        <div class="relative">
                            <input type="checkbox" id="config-autoPlay" class="sr-only toggle-checkbox" onchange="updateAppConfig('autoPlay', this.checked)">
                            <div class="block bg-brandSurface border border-brandBorder w-10 h-6 rounded-full transition toggle-label"></div>
                            <div class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200"></div>
                        </div>
                    </label>
                </div>

                <div class="flex items-center justify-between p-3 border border-brandBorder rounded bg-brandBg h-11">
                    <span class="text-xs font-bold text-brandText">次の動画を自動再生</span>
                    <label class="flex items-center cursor-pointer">
                        <div class="relative">
                            <input type="checkbox" id="config-autoNext" class="sr-only toggle-checkbox" onchange="updateAppConfig('autoNext', this.checked)">
                            <div class="block bg-brandSurface border border-brandBorder w-10 h-6 rounded-full transition toggle-label"></div>
                            <div class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200"></div>
                        </div>
                    </label>
                </div>

                <div class="flex items-center justify-between p-3 border border-brandBorder rounded bg-brandBg h-11">
                    <span class="text-xs font-bold text-brandText">ループ再生</span>
                    <label class="flex items-center cursor-pointer">
                        <div class="relative">
                            <input type="checkbox" id="config-loop" class="sr-only toggle-checkbox" onchange="updateAppConfig('loop', this.checked)">
                            <div class="block bg-brandSurface border border-brandBorder w-10 h-6 rounded-full transition toggle-label"></div>
                            <div class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200"></div>
                        </div>
                    </label>
                </div>

                <div class="flex items-center justify-between p-3 border border-brandBorder rounded bg-brandBg h-11">
                    <span class="text-xs font-bold text-brandText">ミュート状態を記憶</span>
                    <label class="flex items-center cursor-pointer">
                        <div class="relative">
                            <input type="checkbox" id="config-rememberMute" class="sr-only toggle-checkbox" onchange="updateAppConfig('rememberMute', this.checked)">
                            <div class="block bg-brandSurface border border-brandBorder w-10 h-6 rounded-full transition toggle-label"></div>
                            <div class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200"></div>
                        </div>
                    </label>
                </div>
            </div>

            <h3 class="text-sm font-bold text-brandText mb-4 flex items-center gap-2 bg-brandBg py-2 px-3 rounded-lg border border-brandBorder">
                <i data-lucide="hand" class="w-4 h-4 text-brandAccent"></i> 操作・ジェスチャー設定
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <label class="block">
                    <span class="text-xs text-brandMuted block mb-1 font-bold">ダブルタップのシーク秒数</span>
                    <select id="config-doubleTapSeek" class="w-full h-11 px-3 rounded bg-brandBg text-brandText border border-brandBorder outline-none font-bold text-sm" onchange="updateAppConfig('doubleTapSeek', parseInt(this.value))">
                        <option value="5">5秒</option>
                        <option value="10">10秒</option>
                        <option value="15">15秒</option>
                        <option value="30">30秒</option>
                    </select>
                </label>

                <label class="block">
                    <span class="text-xs text-brandMuted block mb-1 font-bold">矢印キーのシーク秒数</span>
                    <select id="config-arrowKeySeek" class="w-full h-11 px-3 rounded bg-brandBg text-brandText border border-brandBorder outline-none font-bold text-sm" onchange="updateAppConfig('arrowKeySeek', parseInt(this.value))">
                        <option value="5">5秒</option>
                        <option value="10">10秒</option>
                        <option value="15">15秒</option>
                        <option value="30">30秒</option>
                    </select>
                </label>

                <label class="block sm:col-span-2">
                    <span class="text-xs text-brandMuted block mb-1 font-bold">コントロールバーの自動非表示</span>
                    <select id="config-controlsHideDelay" class="w-full h-11 px-3 rounded bg-brandBg text-brandText border border-brandBorder outline-none font-bold text-sm" onchange="updateAppConfig('controlsHideDelay', parseInt(this.value))">
                        <option value="0">常に表示する</option>
                        <option value="2">2秒後に隠す</option>
                        <option value="3">3秒後に隠す</option>
                        <option value="5">5秒後に隠す</option>
                        <option value="10">10秒後に隠す</option>
                    </select>
                </label>
            </div>

            <h3 class="text-sm font-bold text-brandText mb-4 flex items-center gap-2 bg-brandBg py-2 px-3 rounded-lg border border-brandBorder">
                <i data-lucide="palette" class="w-4 h-4 text-brandAccent"></i> 表示設定
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <label class="block">
                    <span class="text-xs text-brandMuted block mb-1 font-bold">アクセントカラー</span>
                    <input type="color" id="config-accentColor" class="w-full h-11 px-1 py-1 rounded bg-brandBg border border-brandBorder cursor-pointer" onchange="updateAppConfig('accentColor', this.value)">
                </label>

                <label class="block">
                    <span class="text-xs text-brandMuted block mb-1 font-bold">UIサイズ</span>
                    <select id="config-uiScale" class="w-full h-11 px-3 rounded bg-brandBg text-brandText border border-brandBorder outline-none font-bold text-sm" onchange="updateAppConfig('uiScale', parseInt(this.value))">
                        <option value="85">小</option>
                        <option value="100">標準</option>
                        <option value="115">大</option>
                        <option value="130">特大</option>
                    </select>
                </label>

                <label class="block">
                    <span class="text-xs text-brandMuted block mb-1 font-bold">テーマ</span>
                    <select id="config-theme" class="w-full h-11 px-3 rounded bg-brandBg text-brandText border border-brandBorder outline-none font-bold text-sm" onchange="updateAppConfig('theme', this.value)">
                        <option value="dark">ダーク</option>
                        <option value="light">ライト</option>
                        <option value="auto">端末に合わせる</option>
                    </select>
                </label>

                <label class="block">
                    <span class="text-xs text-brandMuted block mb-1 font-bold">プレイリストの並び順(初期値)</span>
                    <select id="config-defaultSortOrder" class="w-full h-11 px-3 rounded bg-brandBg text-brandText border border-brandBorder outline-none font-bold text-sm" onchange="updateAppConfig('defaultSortOrder', this.value)">
                        <option value="newest">新しい順</option>
                        <option value="oldest">古い順</option>
                    </select>
                </label>

                <div class="flex items-center justify-between p-3 border border-brandBorder rounded bg-brandBg h-11">
                    <span class="text-xs font-bold text-brandText">大画面モードで開始</span>
                    <label class="flex items-center cursor-pointer">
                        <div class="relative">
                            <input type="checkbox" id="config-theaterModeDefault" class="sr-only toggle-checkbox" onchange="updateAppConfig('theaterModeDefault', this.checked)">
                            <div class="block bg-brandSurface border border-brandBorder w-10 h-6 rounded-full transition toggle-label"></div>
                            <div class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200"></div>
                        </div>
                    </label>
                </div>

                <div class="flex items-center justify-between p-3 border border-brandBorder rounded bg-brandBg h-11 sm:col-span-2">
                    <span class="text-xs font-bold text-brandText">モーションを減らす (アニメーション軽減)</span>
                    <label class="flex items-center cursor-pointer">
                        <div class="relative">
                            <input type="checkbox" id="config-reduceMotion" class="sr-only toggle-checkbox" onchange="updateAppConfig('reduceMotion', this.checked)">
                            <div class="block bg-brandSurface border border-brandBorder w-10 h-6 rounded-full transition toggle-label"></div>
                            <div class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200"></div>
                        </div>
                    </label>
                </div>
            </div>

            <h3 class="text-sm font-bold text-brandText mb-4 flex items-center gap-2 bg-brandBg py-2 px-3 rounded-lg border border-brandBorder">
                <i data-lucide="database" class="w-4 h-4 text-brandAccent"></i> データ・通知
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div class="flex items-center justify-between p-3 border border-brandBorder rounded bg-brandBg h-11">
                    <span class="text-xs font-bold text-brandText">視聴履歴を自動記録</span>
                    <label class="flex items-center cursor-pointer">
                        <div class="relative">
                            <input type="checkbox" id="config-recordHistory" class="sr-only toggle-checkbox" onchange="updateAppConfig('recordHistory', this.checked)">
                            <div class="block bg-brandSurface border border-brandBorder w-10 h-6 rounded-full transition toggle-label"></div>
                            <div class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200"></div>
                        </div>
                    </label>
                </div>

                <div class="flex items-center justify-between p-3 border border-brandBorder rounded bg-brandBg h-11">
                    <span class="text-xs font-bold text-brandText">通知設定を開く</span>
                    <button onclick="closeSettings(); openNotificationSettingsModal();" class="text-xs bg-brandSurface border border-brandBorder hover:border-brandAccent text-brandText px-3 py-1.5 rounded-lg font-bold transition">
                        設定
                    </button>
                </div>

                <div class="flex items-center justify-between p-3 border border-brandBorder rounded bg-brandBg h-11">
                    <span class="text-xs font-bold text-brandText">データをエクスポート</span>
                    <button onclick="exportUserData()" class="text-xs bg-brandSurface border border-brandBorder hover:border-brandAccent text-brandText px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1">
                        <i data-lucide="download" class="w-3.5 h-3.5"></i> 保存
                    </button>
                </div>

                <div class="flex items-center justify-between p-3 border border-brandBorder rounded bg-brandBg h-11">
                    <span class="text-xs font-bold text-brandText">データをインポート</span>
                    <button onclick="document.getElementById('importFileInput').click()" class="text-xs bg-brandSurface border border-brandBorder hover:border-brandAccent text-brandText px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1">
                        <i data-lucide="upload" class="w-3.5 h-3.5"></i> 読込
                    </button>
                    <input type="file" id="importFileInput" accept="application/json" class="hidden" onchange="importUserData(this)">
                </div>

                <div class="flex items-center justify-between p-3 border border-red-900/50 rounded bg-brandBg h-11 sm:col-span-2">
                    <span class="text-xs font-bold text-red-500">設定・保存データを全て初期化</span>
                    <button onclick="resetAllSettingsAndData()" class="text-xs bg-red-950/40 border border-red-900 hover:bg-red-900/50 text-red-400 px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1">
                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> 初期化
                    </button>
                </div>
            </div>

            <div class="mt-6 pt-4 border-t border-brandBorder flex justify-end gap-3 sticky bottom-0 bg-brandSurface pb-1">
                <button onclick="closeSettings()" class="px-6 py-3 bg-brandAccent hover:bg-brandAccentHover text-white rounded-full transition text-sm font-bold shadow-lg shadow-brandAccent/30">
                    閉じる
                </button>
            </div>
        </div>
        </div>
    </div>

        <div id="notificationSettingsModal" class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 hidden">
        <div class="bg-brandSurface border border-brandBorder rounded-theme max-w-md w-full max-h-[85vh] flex flex-col p-6 shadow-2xl">
            <div class="flex justify-between items-center pb-3 border-b border-brandBorder flex-shrink-0">
                <h3 class="text-lg font-bold text-brandText flex items-center gap-2"><i data-lucide="bell" class="text-brandAccent"></i><span>通知設定（個別切り替え）</span></h3>
                <button onclick="closeNotificationSettingsModal()" class="text-brandMuted hover:text-brandText transition-colors p-2"><i data-lucide="x" class="w-5 h-5"></i></button>
            </div>
            
            <div class="mt-3 relative flex items-center flex-shrink-0">
                <i data-lucide="search" class="w-4 h-4 text-brandMuted absolute left-3.5 pointer-events-none"></i>
                <input type="text" id="notifSearchInput" oninput="filterNotificationItems()" placeholder="通知項目を検索..." 
                       class="w-full bg-brandBg border border-brandBorder rounded-xl pl-10 pr-9 py-2.5 text-xs text-brandText placeholder-brandMuted focus:border-brandAccent focus:outline-none transition-colors">
                <button id="notifSearchClearBtn" onclick="clearNotifSearch()" class="hidden absolute right-3 text-brandMuted hover:text-brandText transition-colors p-1">
                    <i data-lucide="x" class="w-4 h-4"></i>
                </button>
            </div>

            <div id="notifItemsContainer" class="overflow-y-auto flex-grow my-3 space-y-3 scrollbar-thin max-h-[50vh] pr-1">
                
                <div class="notif-item flex items-center justify-between p-3 bg-brandBg rounded-xl border border-brandBorder" data-title="再生速度の変更" data-desc="速度を変更した際の通知">
                    <div>
                        <p class="text-xs font-bold text-brandText">再生速度の変更</p>
                        <p class="text-[10px] text-brandMuted">速度を変更した際の通知</p>
                    </div>
                    <label class="flex items-center cursor-pointer">
                        <div class="relative">
                            <input type="checkbox" id="notif-playbackRate" class="sr-only toggle-checkbox" checked onchange="updateNotificationCategory('playbackRate', this.checked)">
                            <div class="block bg-brandSurface border border-brandBorder w-10 h-6 rounded-full transition toggle-label"></div>
                            <div class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200"></div>
                        </div>
                    </label>
                </div>

                <div class="notif-item flex items-center justify-between p-3 bg-brandBg rounded-xl border border-brandBorder" data-title="共有・リンクコピー完了" data-desc="共有メニュー起動、URLコピー完了通知">
                    <div>
                        <p class="text-xs font-bold text-brandText">共有・リンクコピー完了</p>
                        <p class="text-[10px] text-brandMuted">共有メニュー起動、URLコピー完了通知</p>
                    </div>
                    <label class="flex items-center cursor-pointer">
                        <div class="relative">
                            <input type="checkbox" id="notif-share" class="sr-only toggle-checkbox" checked onchange="updateNotificationCategory('share', this.checked)">
                            <div class="block bg-brandSurface border border-brandBorder w-10 h-6 rounded-full transition toggle-label"></div>
                            <div class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200"></div>
                        </div>
                    </label>
                </div>

                <div class="notif-item flex items-center justify-between p-3 bg-brandBg rounded-xl border border-brandBorder" data-title="「お気に入り・あとで見る」追加・削除" data-desc="リスト追加、削除操作の完了通知">
                    <div>
                        <p class="text-xs font-bold text-brandText">「お気に入り・あとで見る」追加・削除</p>
                        <p class="text-[10px] text-brandMuted">リスト追加、削除操作の完了通知</p>
                    </div>
                    <label class="flex items-center cursor-pointer">
                        <div class="relative">
                            <input type="checkbox" id="notif-watchLater" class="sr-only toggle-checkbox" checked onchange="updateNotificationCategory('watchLater', this.checked)">
                            <div class="block bg-brandSurface border border-brandBorder w-10 h-6 rounded-full transition toggle-label"></div>
                            <div class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200"></div>
                        </div>
                    </label>
                </div>

                <div class="notif-item flex items-center justify-between p-3 bg-brandBg rounded-xl border border-brandBorder" data-title="視聴履歴の消去" data-desc="履歴クリア操作の完了通知">
                    <div>
                        <p class="text-xs font-bold text-brandText">視聴履歴の消去</p>
                        <p class="text-[10px] text-brandMuted">履歴クリア操作の完了通知</p>
                    </div>
                    <label class="flex items-center cursor-pointer">
                        <div class="relative">
                            <input type="checkbox" id="notif-historyClear" class="sr-only toggle-checkbox" checked onchange="updateNotificationCategory('historyClear', this.checked)">
                            <div class="block bg-brandSurface border border-brandBorder w-10 h-6 rounded-full transition toggle-label"></div>
                            <div class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200"></div>
                        </div>
                    </label>
                </div>

                <div class="notif-item flex items-center justify-between p-3 bg-brandBg rounded-xl border border-brandBorder" data-title="続きから再生（レジューム）" data-desc="前回停止位置からの再開通知">
                    <div>
                        <p class="text-xs font-bold text-brandText">続きから再生（レジューム）</p>
                        <p class="text-[10px] text-brandMuted">前回停止位置からの再開通知</p>
                    </div>
                    <label class="flex items-center cursor-pointer">
                        <div class="relative">
                            <input type="checkbox" id="notif-resume" class="sr-only toggle-checkbox" checked onchange="updateNotificationCategory('resume', this.checked)">
                            <div class="block bg-brandSurface border border-brandBorder w-10 h-6 rounded-full transition toggle-label"></div>
                            <div class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200"></div>
                        </div>
                    </label>
                </div>

                <div class="notif-item flex items-center justify-between p-3 bg-brandBg rounded-xl border border-brandBorder" data-title="大画面モードの切替" data-desc="シアターモードON/OFF時の通知">
                    <div>
                        <p class="text-xs font-bold text-brandText">大画面モードの切替</p>
                        <p class="text-[10px] text-brandMuted">シアターモードON/OFF時の通知</p>
                    </div>
                    <label class="flex items-center cursor-pointer">
                        <div class="relative">
                            <input type="checkbox" id="notif-theaterMode" class="sr-only toggle-checkbox" checked onchange="updateNotificationCategory('theaterMode', this.checked)">
                            <div class="block bg-brandSurface border border-brandBorder w-10 h-6 rounded-full transition toggle-label"></div>
                            <div class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200"></div>
                        </div>
                    </label>
                </div>

                <div class="notif-item flex items-center justify-between p-3 bg-brandBg rounded-xl border border-brandBorder" data-title="次の動画への自動再生" data-desc="プレイリストの続きへ自動遷移した際の通知">
                    <div>
                        <p class="text-xs font-bold text-brandText">次の動画への自動再生</p>
                        <p class="text-[10px] text-brandMuted">プレイリストの続きへ自動遷移した際の通知</p>
                    </div>
                    <label class="flex items-center cursor-pointer">
                        <div class="relative">
                            <input type="checkbox" id="notif-autoNext" class="sr-only toggle-checkbox" checked onchange="updateNotificationCategory('autoNext', this.checked)">
                            <div class="block bg-brandSurface border border-brandBorder w-10 h-6 rounded-full transition toggle-label"></div>
                            <div class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200"></div>
                        </div>
                    </label>
                </div>

                <div class="notif-item flex items-center justify-between p-3 bg-brandBg rounded-xl border border-brandBorder" data-title="画像保存・ダウンロード" data-desc="画像の保存開始、動画ダウンロード開始通知">
                    <div>
                        <p class="text-xs font-bold text-brandText">画像保存・ダウンロード</p>
                        <p class="text-[10px] text-brandMuted">画像の保存開始、動画ダウンロード開始通知</p>
                    </div>
                    <label class="flex items-center cursor-pointer">
                        <div class="relative">
                            <input type="checkbox" id="notif-download" class="sr-only toggle-checkbox" checked onchange="updateNotificationCategory('download', this.checked)">
                            <div class="block bg-brandSurface border border-brandBorder w-10 h-6 rounded-full transition toggle-label"></div>
                            <div class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200"></div>
                        </div>
                    </label>
                </div>

                <div class="notif-item flex items-center justify-between p-3 bg-brandBg rounded-xl border border-brandBorder" data-title="ログイン・ログアウト" data-desc="ログアウト完了、ログイン必須の案内通知">
                    <div>
                        <p class="text-xs font-bold text-brandText">ログイン・ログアウト</p>
                        <p class="text-[10px] text-brandMuted">ログアウト完了、ログイン必須の案内通知</p>
                    </div>
                    <label class="flex items-center cursor-pointer">
                        <div class="relative">
                            <input type="checkbox" id="notif-account" class="sr-only toggle-checkbox" checked onchange="updateNotificationCategory('account', this.checked)">
                            <div class="block bg-brandSurface border border-brandBorder w-10 h-6 rounded-full transition toggle-label"></div>
                            <div class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200"></div>
                        </div>
                    </label>
                </div>

                <div class="notif-item flex items-center justify-between p-3 bg-brandBg rounded-xl border border-brandBorder" data-title="データのバックアップ・初期化" data-desc="エクスポート、インポート、全データ初期化の通知">
                    <div>
                        <p class="text-xs font-bold text-brandText">データのバックアップ・初期化</p>
                        <p class="text-[10px] text-brandMuted">エクスポート、インポート、全データ初期化の通知</p>
                    </div>
                    <label class="flex items-center cursor-pointer">
                        <div class="relative">
                            <input type="checkbox" id="notif-data" class="sr-only toggle-checkbox" checked onchange="updateNotificationCategory('data', this.checked)">
                            <div class="block bg-brandSurface border border-brandBorder w-10 h-6 rounded-full transition toggle-label"></div>
                            <div class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200"></div>
                        </div>
                    </label>
                </div>

                <div class="notif-item flex items-center justify-between p-3 bg-brandBg rounded-xl border border-brandBorder" data-title="その他（エラー等）" data-desc="上記に当てはまらないその他の通知">
                    <div>
                        <p class="text-xs font-bold text-brandText">その他（エラー等）</p>
                        <p class="text-[10px] text-brandMuted">上記に当てはまらないその他の通知</p>
                    </div>
                    <label class="flex items-center cursor-pointer">
                        <div class="relative">
                            <input type="checkbox" id="notif-system" class="sr-only toggle-checkbox" checked onchange="updateNotificationCategory('system', this.checked)">
                            <div class="block bg-brandSurface border border-brandBorder w-10 h-6 rounded-full transition toggle-label"></div>
                            <div class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200"></div>
                        </div>
                    </label>
                </div>

                <div id="noNotifMatchMsg" class="hidden text-center py-6 text-brandMuted text-xs font-bold">
                    一致する通知項目が見つかりません
                </div>
            </div>

            <div class="pt-3 border-t border-brandBorder flex gap-2 flex-shrink-0">
                <button onclick="setAllNotifications(false)" class="w-1/2 py-3 bg-brandBg border border-brandBorder hover:border-brandAccent text-brandMuted hover:text-brandText rounded-xl text-xs font-bold transition-all min-h-[44px]">すべてOFF</button>
                <button onclick="setAllNotifications(true)" class="w-1/2 py-3 bg-brandAccent hover:bg-brandAccentHover text-white rounded-xl text-xs font-bold transition-all shadow-lg min-h-[44px]">すべてON</button>
            </div>
        </div>
    </div>

        <div id="resumeModal" class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 hidden">
        <div class="bg-brandSurface border border-brandBorder rounded-theme max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
            <div class="w-12 h-12 bg-brandAccent/20 text-brandAccent rounded-full flex items-center justify-center mx-auto mb-2">
                <i data-lucide="play-circle" class="w-6 h-6"></i>
            </div>
            <h3 class="text-base font-bold text-brandText">前回の続きから再生しますか？</h3>
            <p id="resumeTimeText" class="text-xs text-brandMuted">再生位置: 00:00</p>
            <div class="flex gap-3 pt-2">
                <button onclick="confirmResume(false)" class="w-1/2 py-3 bg-brandBg border border-brandBorder hover:border-brandText text-brandMuted hover:text-brandText rounded-xl text-xs font-bold transition-all min-h-[44px]">最初から</button>
                <button onclick="confirmResume(true)" class="w-1/2 py-3 bg-brandAccent hover:bg-brandAccentHover text-white rounded-xl text-xs font-bold transition-all shadow-lg min-h-[44px]">続きから再生</button>
            </div>
        </div>
    </div>

        <div id="shortcutsModal" class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 hidden">
        <div class="bg-brandSurface border border-brandBorder rounded-theme max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div class="flex justify-between items-center pb-3 border-b border-brandBorder">
                <h3 class="text-base font-bold text-brandText flex items-center gap-2"><i data-lucide="keyboard" class="text-brandAccent"></i><span>ショートカットキー</span></h3>
                <button onclick="closeShortcutsModal()" class="text-brandMuted hover:text-brandText transition-colors p-2"><i data-lucide="x" class="w-5 h-5"></i></button>
            </div>
            <div class="space-y-2 text-xs">
                <div class="flex justify-between items-center bg-brandBg p-3 rounded-xl border border-brandBorder"><span class="text-brandMuted font-mono">Space / K</span><span class="font-bold text-brandText">再生 / 一時停止</span></div>
                <div class="flex justify-between items-center bg-brandBg p-3 rounded-xl border border-brandBorder"><span class="text-brandMuted font-mono">T</span><span class="font-bold text-brandText">大画面モード切替</span></div>
                <div class="flex justify-between items-center bg-brandBg p-3 rounded-xl border border-brandBorder"><span class="text-brandMuted font-mono">F</span><span class="font-bold text-brandText">全画面表示</span></div>
                <div class="flex justify-between items-center bg-brandBg p-3 rounded-xl border border-brandBorder"><span class="text-brandMuted font-mono">M</span><span class="font-bold text-brandText">ミュート切り替え</span></div>
                <div class="flex justify-between items-center bg-brandBg p-3 rounded-xl border border-brandBorder"><span class="text-brandMuted font-mono">← / →</span><span class="font-bold text-brandText">5秒移動 / 画像切替</span></div>
                <div class="flex justify-between items-center bg-brandBg p-3 rounded-xl border border-brandBorder"><span class="text-brandMuted font-mono">↑ / ↓</span><span class="font-bold text-brandText">音量 5% 変更</span></div>
            </div>
            <button onclick="closeShortcutsModal()" class="w-full py-3 bg-brandBg border border-brandBorder hover:border-brandAccent text-brandText rounded-xl text-xs font-bold transition-all">閉じる</button>
        </div>
    </div>

        <div id="historyModal" class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 hidden">
        <div class="bg-brandSurface border border-brandBorder rounded-theme max-w-md w-full max-h-[85vh] flex flex-col p-6 shadow-2xl">
            <div class="flex justify-between items-center pb-3 border-b border-brandBorder flex-shrink-0">
                <h3 class="text-lg font-bold text-brandText flex items-center gap-2"><i data-lucide="history" class="text-brandAccent"></i><span>視聴履歴</span></h3>
                <button onclick="closeHistoryModal()" class="text-brandMuted hover:text-brandText transition-colors p-2"><i data-lucide="x" class="w-5 h-5"></i></button>
            </div>
            <div id="historyListContainer" class="overflow-y-auto flex-grow py-4 space-y-3 scrollbar-thin"></div>
            <div class="pt-3 border-t border-brandBorder flex gap-2 flex-shrink-0">
                <button onclick="clearHistory()" class="w-1/2 py-3 bg-red-950/40 border border-red-900/60 hover:bg-red-900/60 text-red-400 rounded-xl text-xs font-bold transition-all min-h-[44px]">履歴を消去</button>
                <button onclick="closeHistoryModal()" class="w-1/2 py-3 bg-brandBg border border-brandBorder hover:border-brandAccent text-brandText rounded-xl text-xs font-bold transition-all min-h-[44px]">閉じる</button>
            </div>
        </div>
    </div>

        <div id="favoritesModal" class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 hidden">
        <div class="bg-brandSurface border border-brandBorder rounded-theme max-w-md w-full max-h-[85vh] flex flex-col p-6 shadow-2xl">
            <div class="flex justify-between items-center pb-3 border-b border-brandBorder flex-shrink-0">
                <h3 class="text-lg font-bold text-brandText flex items-center gap-2"><i data-lucide="heart" class="text-rose-400"></i><span>お気に入り</span></h3>
                <button onclick="closeFavoritesModal()" class="text-brandMuted hover:text-brandText transition-colors p-2"><i data-lucide="x" class="w-5 h-5"></i></button>
            </div>
            <div id="favoritesListContainer" class="overflow-y-auto flex-grow py-4 space-y-3 scrollbar-thin"></div>
            <div class="pt-3 border-t border-brandBorder flex-shrink-0">
                <button onclick="closeFavoritesModal()" class="w-full py-3 bg-brandBg border border-brandBorder hover:border-brandAccent text-brandText rounded-xl text-xs font-bold transition-all min-h-[44px]">閉じる</button>
            </div>
        </div>
    </div>

        <div id="savesModal" class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 hidden">
        <div class="bg-brandSurface border border-brandBorder rounded-theme max-w-md w-full max-h-[85vh] flex flex-col p-6 shadow-2xl">
            <div class="flex justify-between items-center pb-3 border-b border-brandBorder flex-shrink-0">
                <h3 class="text-lg font-bold text-brandText flex items-center gap-2"><i data-lucide="bookmark" class="text-amber-400"></i><span>あとで見る</span></h3>
                <button onclick="closeSavesModal()" class="text-brandMuted hover:text-brandText transition-colors p-2"><i data-lucide="x" class="w-5 h-5"></i></button>
            </div>
            <div id="savesListContainer" class="overflow-y-auto flex-grow py-4 space-y-3 scrollbar-thin"></div>
            <div class="pt-3 border-t border-brandBorder flex-shrink-0">
                <button onclick="closeSavesModal()" class="w-full py-3 bg-brandBg border border-brandBorder hover:border-brandAccent text-brandText rounded-xl text-xs font-bold transition-all min-h-[44px]">閉じる</button>
            </div>
        </div>
    </div>

        <div id="downloadModal" class="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 hidden">
        <div id="downloadModalContainer" class="bg-brandSurface border border-brandBorder rounded-theme max-w-md w-full max-h-[85vh] flex flex-col p-6 shadow-2xl">
            <div class="flex justify-between items-center pb-3 border-b border-brandBorder flex-shrink-0">
                <h3 class="text-lg font-bold text-brandText flex items-center gap-2"><i data-lucide="info" class="text-brandAccent"></i><span>ダウンロード方法</span></h3>
                <button onclick="closeModal()" class="text-brandMuted hover:text-brandText transition-colors p-2"><i data-lucide="x" class="w-5 h-5"></i></button>
            </div>
            <div class="overflow-y-auto flex-grow py-4 pr-1 space-y-4 scrollbar-thin">
                <p id="downloadReason" class="hidden text-[11px] text-red-400 bg-brandBg border border-brandBorder rounded-xl p-3 leading-relaxed break-all"></p>
<div class="space-y-3">
                    <details class="group bg-brandBg rounded-2xl border border-brandBorder overflow-hidden" open>
                        <summary class="flex justify-between items-center p-4 cursor-pointer select-none hover:bg-brandSurface transition-colors">
                            <span class="text-sm font-black text-brandText flex items-center gap-2"><i data-lucide="smartphone" class="w-4 h-4 text-blue-400"></i>iPhone</span>
                            <i data-lucide="chevron-down" class="w-4 h-4 text-brandMuted transition-transform duration-200 group-open:rotate-180"></i>
                        </summary>
                        <div class="p-4 border-t border-brandBorder text-xs text-brandMuted space-y-3 leading-relaxed">
                            <p>1. こちらを「<a href="https://www.icloud.com/shortcuts/a6ca0b7cf395429bbdef8a541cdd6b1e" target="_blank" class="gradient underline font-bold hover:opacity-80 transition-opacity">ダウンロード</a>」してください。</p>
                            <p>2. 次に共有マークを押して、先ほどダウンロードしたショートカット（保存）を実行。</p>
                            <p>3. 許可を求められたら「常に許可」を押してください。</p>
                            <div class="pt-2 border-t border-brandBorder">手順を覚えたら「<a id="iphoneDirectLink" href="#" target="_blank" class="gradient underline font-bold">こちら</a>」</div>
                        </div>
                    </details>
                    <details class="group bg-brandBg rounded-2xl border border-brandBorder overflow-hidden">
                        <summary class="flex justify-between items-center p-4 cursor-pointer select-none hover:bg-brandSurface transition-colors">
                            <span class="text-sm font-black text-brandText flex items-center gap-2"><i data-lucide="smartphone" class="w-4 h-4 text-green-400"></i>Android</span>
                            <i data-lucide="chevron-down" class="w-4 h-4 text-brandMuted transition-transform duration-200 group-open:rotate-180"></i>
                        </summary>
                        <div class="p-4 border-t border-brandBorder text-xs text-brandMuted space-y-3 leading-relaxed">
                            <p>1. 動画を長押しして保存を選択</p>
                            <div class="pt-2 border-t border-brandBorder">手順を覚えたら「<a id="androidDirectLink" href="#" target="_blank" class="gradient underline font-bold">こちら</a>」</div>
                        </div>
                    </details>
                </div>
            </div>
            <div class="pt-3 border-t border-brandBorder flex-shrink-0">
                <button onclick="closeModal()" class="w-full py-3 bg-brandBg border border-brandBorder hover:border-brandAccent active:scale-95 transition-all text-brandText rounded-xl text-xs font-bold min-h-[44px]">閉じる</button>
            </div>
        </div>
    </div>

        <div id="addVideoModal" class="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 hidden">
        <div class="bg-brandSurface border border-brandBorder rounded-theme max-w-md w-full max-h-[85vh] flex flex-col p-6 shadow-2xl">
            <div class="flex justify-between items-center pb-3 border-b border-brandBorder flex-shrink-0">
                <h3 class="text-lg font-bold text-brandText flex items-center gap-2"><i data-lucide="plus-circle" class="text-brandAccent"></i><span>動画・画像を追加</span></h3>
                <button onclick="closeAddVideoModal()" class="text-brandMuted hover:text-brandText transition-colors p-2"><i data-lucide="x" class="w-5 h-5"></i></button>
            </div>
            <form id="addVideoForm" onsubmit="submitAddVideo(event)" class="overflow-y-auto flex-grow py-4 pr-1 space-y-3 scrollbar-thin">
                <div>
                    <label class="text-[11px] font-bold text-brandMuted block mb-1">タイプ</label>
                    <select id="addVideoType" onchange="toggleAddVideoFields()" class="w-full bg-brandBg border border-brandBorder rounded-xl px-3 py-2.5 text-xs text-brandText focus:border-brandAccent focus:outline-none">
                        <option value="video">動画</option>
                        <option value="image">画像</option>
                    </select>
                </div>
                <div>
                    <label class="text-[11px] font-bold text-brandMuted block mb-1">タイトル</label>
                    <input type="text" id="addVideoTitle" required class="w-full bg-brandBg border border-brandBorder rounded-xl px-3 py-2.5 text-xs text-brandText focus:border-brandAccent focus:outline-none">
                </div>
                <div id="addVideoUrlField">
                    <label class="text-[11px] font-bold text-brandMuted block mb-1">動画URL</label>
                    <input type="text" id="addVideoUrl" class="w-full bg-brandBg border border-brandBorder rounded-xl px-3 py-2.5 text-xs text-brandText focus:border-brandAccent focus:outline-none">
                </div>
                <div id="addVideoImagesField" class="hidden">
                    <label class="text-[11px] font-bold text-brandMuted block mb-1">画像URL(1行に1つ)</label>
                    <textarea id="addVideoImages" rows="3" class="w-full bg-brandBg border border-brandBorder rounded-xl px-3 py-2.5 text-xs text-brandText focus:border-brandAccent focus:outline-none"></textarea>
                </div>
                <div>
                    <label class="text-[11px] font-bold text-brandMuted block mb-1">サムネイルURL</label>
                    <input type="text" id="addVideoThumbnail" required class="w-full bg-brandBg border border-brandBorder rounded-xl px-3 py-2.5 text-xs text-brandText focus:border-brandAccent focus:outline-none">
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="text-[11px] font-bold text-brandMuted block mb-1">再生時間/枚数表記</label>
                        <input type="text" id="addVideoDuration" placeholder="例: 0:25 / 8枚" required class="w-full bg-brandBg border border-brandBorder rounded-xl px-3 py-2.5 text-xs text-brandText focus:border-brandAccent focus:outline-none">
                    </div>
                    <div>
                        <label class="text-[11px] font-bold text-brandMuted block mb-1">日付</label>
                        <input type="text" id="addVideoDate" placeholder="2026/10/02" required class="w-full bg-brandBg border border-brandBorder rounded-xl px-3 py-2.5 text-xs text-brandText focus:border-brandAccent focus:outline-none">
                    </div>
                </div>
                <div>
                    <label class="text-[11px] font-bold text-brandMuted block mb-1">説明</label>
                    <textarea id="addVideoDesc" rows="2" class="w-full bg-brandBg border border-brandBorder rounded-xl px-3 py-2.5 text-xs text-brandText focus:border-brandAccent focus:outline-none"></textarea>
                </div>
                <button type="submit" class="w-full py-3 bg-brandAccent active:scale-95 transition-all text-black rounded-xl text-xs font-bold min-h-[44px]">追加する</button>
            </form>
        </div>
    </div>

        <div id="toast" class="fixed bottom-5 right-5 z-50 transform translate-y-10 opacity-0 pointer-events-none transition-all duration-300 bg-brandSurface border border-brandBorder text-brandText px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3">
        <div class="bg-brandAccent/20 text-brandAccent p-1 rounded-md"><i data-lucide="bell" class="w-4 h-4"></i></div>
        <span id="toastMsg" class="text-xs font-bold">通知メッセージ</span>
    </div>

        
`;

(function buildAppLayout() {
    const body = document.body;
    Array.from(body.children).forEach((el) => {
        if (el.tagName !== 'SCRIPT') el.remove();
    });
    body.removeAttribute('style');
    body.className = 'min-h-screen flex flex-col selection:bg-brandAccent selection:text-white transition-colors duration-500';
    body.insertAdjacentHTML('afterbegin', APP_LAYOUT_HTML);
})();

window.__firebase_config = JSON.stringify({
    apiKey: "AIzaSyCMct_8D2DIqRifQIOsapJxRZah53o5RVs",
    authDomain: "gvn-org-cloud.firebaseapp.com",
    projectId: "gvn-org-cloud",
    storageBucket: "gvn-org-cloud.firebasestorage.app",
    messagingSenderId: "775860589726",
    appId: "1:775860589726:web:c18f9bc5765d9b1f87978f"
});

(async function initFirebaseSync() {
    const appId = typeof __app_id !== 'undefined' ? __app_id : window.APP_UNIQUE_ID;
    let db = null;
    let auth = null;
    let authUser = null;

    let firestoreReadyResolve;
    window.firestoreReady = new Promise((resolve) => { firestoreReadyResolve = resolve; });

    if (typeof __firebase_config !== 'undefined' && __firebase_config) {
        try {
            const { initializeApp } = await import('https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js');
            const { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged } = await import('https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js');
            const {
                getFirestore, initializeFirestore, collection, doc, addDoc, setDoc, getDoc, getDocs,
                deleteDoc, onSnapshot, query, orderBy, serverTimestamp
            } = await import('https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js');

            const firebaseConfig = JSON.parse(__firebase_config);
            const app = initializeApp(firebaseConfig);
            auth = getAuth(app);
            try {
                db = initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
            } catch (e) {
                db = getFirestore(app);
            }

            window.firestoreFns = {
                collection, doc, addDoc, setDoc, getDoc, getDocs,
                deleteDoc, onSnapshot, query, orderBy, serverTimestamp
            };

            const initAuth = async () => {
                try {
                    if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                        await signInWithCustomToken(auth, __initial_auth_token);
                    } else {
                        await signInAnonymously(auth);
                    }
                } catch (err) {
                    console.error('Firebase認証エラー:', err);
                } finally {
                    firestoreReadyResolve();
                }
            };
            initAuth();

            onAuthStateChanged(auth, (user) => {
                authUser = user;
                if (user && window.currentUser) {
                    if (typeof syncUserDataFromCloud === 'function') syncUserDataFromCloud();
                }
            });
        } catch (e) {
            console.error('Firebase初期化エラー:', e);
            firestoreReadyResolve();
        }
    } else {
        firestoreReadyResolve();
    }

    window.db = db;
    window.getAuthUser = () => authUser;
    window.appId = appId;
})();

        const STORAGE_PREFIX = window.APP_UNIQUE_ID + "_";

        let savedScrollY = 0;
        function lockBodyScroll() {
            if (document.body.dataset.scrollLocked === '1') return;
            savedScrollY = window.scrollY || window.pageYOffset || 0;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${savedScrollY}px`;
            document.body.style.left = '0';
            document.body.style.right = '0';
            document.body.style.width = '100%';
            document.body.dataset.scrollLocked = '1';
        }
        function unlockBodyScroll() {
            if (document.body.dataset.scrollLocked !== '1') return;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.width = '';
            document.body.dataset.scrollLocked = '';
            window.scrollTo(0, savedScrollY);
        }

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

        const NOTIFICATION_CATEGORIES = ['playbackRate', 'share', 'watchLater', 'historyClear', 'resume', 'theaterMode', 'autoNext', 'download', 'account', 'data', 'system'];

        const notificationSettings = getStoredData('notifications_config', {
            playbackRate: true,
            share: true,
            watchLater: true,
            historyClear: true,
            resume: true,
            theaterMode: true,
            autoNext: true,
            download: true,
            account: true,
            data: true,
            system: true
        });

        const DEFAULT_APP_CONFIG = {
            playbackRate: 1.0,
            autoPlay: true,
            defaultVolume: 100,
            rememberMute: false,
            loop: false,
            autoNext: true,
            doubleTapSeek: 10,
            arrowKeySeek: 5,
            controlsHideDelay: 3,
            theaterModeDefault: false,
            reduceMotion: false,
            defaultSortOrder: "newest",
            accentColor: "#ea580c",
            uiScale: 100,
            recordHistory: true,
            theme: "dark"
        };
        const appConfig = Object.assign({}, DEFAULT_APP_CONFIG, getStoredData('app_config', {}));

        let searchQuery = "";
        let currentSortOrder = appConfig.defaultSortOrder;
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
            const categories = NOTIFICATION_CATEGORIES;
            categories.forEach(cat => {
                notificationSettings[cat] = enable;
                const checkbox = document.getElementById(`notif-${cat}`);
                if (checkbox) checkbox.checked = enable;
            });
            setStoredData('notifications_config', notificationSettings);
            showToast(enable ? "すべての通知をONにしました" : "すべての通知をOFFにしました", "system");
        }

        function openNotificationSettingsModal() {
            const categories = NOTIFICATION_CATEGORIES;
            categories.forEach(cat => {
                const checkbox = document.getElementById(`notif-${cat}`);
                if (checkbox) checkbox.checked = !!notificationSettings[cat];
            });
            clearNotifSearch();
            lockBodyScroll();
            document.getElementById('notificationSettingsModal').classList.remove('hidden');
        }

        function closeNotificationSettingsModal() {
            document.getElementById('notificationSettingsModal').classList.add('hidden');
            unlockBodyScroll();
        }

        function updateAppConfig(key, value) {
            appConfig[key] = value;
            setStoredData('app_config', appConfig);

            switch (key) {
                case 'playbackRate':
                    if (player) player.playbackRate = value;
                    showToast(`再生速度を ${value}x に変更しました`, 'playbackRate');
                    break;
                case 'defaultVolume':
                    if (player) { player.volume = value / 100; }
                    break;
                case 'loop':
                    if (player) player.loop = value;
                    break;
                case 'defaultSortOrder':
                    currentSortOrder = value;
                    renderPlaylist();
                    break;
                case 'theaterModeDefault':
                    if (value !== isTheaterMode) toggleTheaterMode(true);
                    break;
                case 'reduceMotion':
                    applyReduceMotion(value);
                    break;
                case 'accentColor':
                    applyAccentColor(value);
                    break;
                case 'uiScale':
                    applyUiScale(value);
                    break;
                case 'theme':
                    applyTheme(value);
                    break;
                case 'doubleTapSeek':
                    updateSkipLabels();
                    break;
            }
        }

        function darkenHexColor(hex, percent) {
            hex = (hex || '#ea580c').replace('#', '');
            if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
            const num = parseInt(hex, 16);
            let r = Math.max(0, (num >> 16) - Math.round(255 * percent / 100));
            let g = Math.max(0, ((num >> 8) & 0x00FF) - Math.round(255 * percent / 100));
            let b = Math.max(0, (num & 0x0000FF) - Math.round(255 * percent / 100));
            return '#' + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
        }

        function applyAccentColor(hex) {
            const root = document.documentElement;
            root.style.setProperty('--accent', hex);
            root.style.setProperty('--accent-hover', darkenHexColor(hex, 15));
            root.style.setProperty('--shadow-color', hex);
        }

        function resolveTheme(t) {
            if (t === 'auto') {
                return (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) ? 'light' : 'dark';
            }
            return t === 'light' ? 'light' : 'dark';
        }

        function applyTheme(t) {
            document.documentElement.setAttribute('data-theme', resolveTheme(t));
        }

        function applyUiScale(pct) {
            document.documentElement.style.fontSize = pct + '%';
        }

        function applyReduceMotion(enabled) {
            document.documentElement.classList.toggle('reduce-motion', !!enabled);
        }

        function updateSkipLabels() {
            const sec = appConfig.doubleTapSeek;
            const leftText = document.getElementById('leftRippleText');
            const rightText = document.getElementById('rightRippleText');
            if (leftText) leftText.textContent = `${sec}秒戻る`;
            if (rightText) rightText.textContent = `${sec}秒進む`;
            const skipBackBtn = document.getElementById('skipBackBtn');
            const skipForwardBtn = document.getElementById('skipForwardBtn');
            if (skipBackBtn) skipBackBtn.title = `${sec}秒戻る`;
            if (skipForwardBtn) skipForwardBtn.title = `${sec}秒進む`;
        }

        function applyStartupConfig() {
            applyAccentColor(appConfig.accentColor);
            applyUiScale(appConfig.uiScale);
            applyTheme(appConfig.theme);
            applyReduceMotion(appConfig.reduceMotion);
            updateSkipLabels();
            if (appConfig.theaterModeDefault) toggleTheaterMode(true);
        }

        function getNextVideoId() {
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
            const idx = filtered.findIndex(v => v.id === activeId);
            if (idx === -1 || idx === filtered.length - 1) return null;
            return filtered[idx + 1].id;
        }

        function exportUserData() {
            const data = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(STORAGE_PREFIX)) {
                    data[key.slice(STORAGE_PREFIX.length)] = localStorage.getItem(key);
                }
            }
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${window.APP_UNIQUE_ID}_backup_${new Date().toISOString().slice(0,10)}.json`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            showToast("データをエクスポートしました", "data");
        }

        function importUserData(fileInput) {
            const file = fileInput.files && fileInput.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    Object.keys(data).forEach(key => {
                        localStorage.setItem(STORAGE_PREFIX + key, data[key]);
                    });
                    showToast("データを読み込みました。再読み込みします", "data");
                    setTimeout(() => location.reload(), 1000);
                } catch (err) {
                    showToast("ファイルの読み込みに失敗しました", "data");
                }
            };
            reader.readAsText(file);
            fileInput.value = '';
        }

        function buildMyPageHTML() {
            const uniqueWatchedIds = [...new Set(userWatchHistory.map(h => h.id))];
            const watchedCount = uniqueWatchedIds.length;
            const savedCount = userSaved.length;
            const totalCount = videos.length;
            const recent = userWatchHistory.slice(0, 6)
                .map(h => videos.find(v => v.id === h.id))
                .filter(Boolean);

            const recentHtml = recent.length > 0 ? recent.map(v => `
                <div onclick="closeMyPage(); loadMedia(${v.id});" class="cursor-pointer group">
                    <div class="aspect-video rounded-lg overflow-hidden border border-brandBorder relative bg-brandBg">
                        <img src="${v.thumbnail}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="">
                        <span class="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">${v.duration || ''}</span>
                    </div>
                    <p class="text-[11px] text-brandText font-bold mt-1 truncate">${v.title || '(無題)'}</p>
                </div>
            `).join('') : `<p class="text-xs text-brandMuted col-span-3 sm:col-span-4 text-center py-10">まだ視聴履歴がありません</p>`;

            return `
            <div id="myPageModal" class="fixed inset-0 bg-brandBg z-[60] flex flex-col opacity-0 translate-y-3 transition-all duration-300">
                <div class="flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-brandBorder bg-brandSurface flex-shrink-0 shadow-sm">
                    <button onclick="closeMyPage()" class="p-2 -ml-2 rounded-full hover:bg-brandBg transition active:scale-90 text-brandText">
                        <i data-lucide="arrow-left" class="w-5 h-5"></i>
                    </button>
                    <h1 class="text-base font-black text-brandText tracking-wide flex items-center gap-2">
                        <i data-lucide="layout-dashboard" class="w-4 h-4 text-brandAccent"></i> マイページ
                    </h1>
                </div>

                <div class="flex-1 overflow-y-auto scrollbar-thin" id="myPageContent">
                    <div class="max-w-2xl mx-auto p-5 sm:p-8">

                        <div class="flex items-center gap-4 mb-8 pb-6 border-b border-brandBorder">
                            <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-brandSurface border-2 border-brandAccent overflow-hidden flex items-center justify-center flex-shrink-0 shadow-lg shadow-brandAccent/20">
                                ${currentUserAvatar ? `<img src="${currentUserAvatar}" class="w-full h-full object-cover" alt="">` : `<i data-lucide="user" class="w-10 h-10 text-brandMuted"></i>`}
                            </div>
                            <div class="min-w-0">
                                <p class="text-xl sm:text-2xl font-black text-brandText truncate">${currentUser || 'ゲスト'}</p>
                                ${currentUserDiscordId ? `<p onclick="navigator.clipboard && navigator.clipboard.writeText('${currentUserDiscordId}').then(()=>showToast('IDをコピーしました','account'))" class="text-[11px] text-brandMuted font-mono mt-0.5 cursor-pointer active:opacity-60 truncate" title="タップでコピー">ID: ${currentUserDiscordId}</p>` : ''}
                                <p class="text-xs text-brandAccent font-bold flex items-center gap-1 mt-1"><i data-lucide="check-circle" class="w-3.5 h-3.5"></i> ログイン中</p>
                            </div>
                        </div>

                        <div class="grid grid-cols-3 gap-3 mb-8">
                            <div class="bg-brandSurface border border-brandBorder rounded-xl p-4 text-center">
                                <p class="text-2xl sm:text-3xl font-black text-brandAccent">${watchedCount}</p>
                                <p class="text-[10px] sm:text-xs text-brandMuted font-bold mt-1">視聴済み</p>
                            </div>
                            <div class="bg-brandSurface border border-brandBorder rounded-xl p-4 text-center">
                                <p class="text-2xl sm:text-3xl font-black text-brandAccent">${savedCount}</p>
                                <p class="text-[10px] sm:text-xs text-brandMuted font-bold mt-1">あとで見る</p>
                            </div>
                            <div class="bg-brandSurface border border-brandBorder rounded-xl p-4 text-center">
                                <p class="text-2xl sm:text-3xl font-black text-brandAccent">${totalCount}</p>
                                <p class="text-[10px] sm:text-xs text-brandMuted font-bold mt-1">全コンテンツ</p>
                            </div>
                        </div>

                        <h3 class="text-xs font-bold text-brandMuted mb-3 flex items-center gap-1.5"><i data-lucide="clock" class="w-3.5 h-3.5"></i> 最近見た動画</h3>
                        <div class="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-8">
                            ${recentHtml}
                        </div>

                        <h3 class="text-xs font-bold text-brandMuted mb-3 flex items-center gap-1.5"><i data-lucide="zap" class="w-3.5 h-3.5"></i> クイックアクション</h3>
                        <div class="grid grid-cols-2 gap-2.5 mb-2">
                            <button onclick="closeMyPage(); openHistoryModal();" class="flex items-center gap-2 text-xs font-bold text-brandText bg-brandSurface border border-brandBorder hover:border-brandAccent rounded-lg px-3 py-3 transition"><i data-lucide="history" class="w-4 h-4 text-brandMuted"></i> 視聴履歴</button>
                            <button onclick="closeMyPage(); openSavesModal();" class="flex items-center gap-2 text-xs font-bold text-brandText bg-brandSurface border border-brandBorder hover:border-brandAccent rounded-lg px-3 py-3 transition"><i data-lucide="bookmark" class="w-4 h-4 text-brandMuted"></i> あとで見る</button>
                            <button onclick="closeMyPage(); openSettings();" class="flex items-center gap-2 text-xs font-bold text-brandText bg-brandSurface border border-brandBorder hover:border-brandAccent rounded-lg px-3 py-3 transition"><i data-lucide="settings" class="w-4 h-4 text-brandMuted"></i> 設定</button>
                            <button onclick="closeMyPage(); openNotificationSettingsModal();" class="flex items-center gap-2 text-xs font-bold text-brandText bg-brandSurface border border-brandBorder hover:border-brandAccent rounded-lg px-3 py-3 transition"><i data-lucide="bell" class="w-4 h-4 text-brandMuted"></i> 通知設定</button>
                            <button onclick="closeMyPage(); showShortcutsModal();" class="flex items-center gap-2 text-xs font-bold text-brandText bg-brandSurface border border-brandBorder hover:border-brandAccent rounded-lg px-3 py-3 transition"><i data-lucide="keyboard" class="w-4 h-4 text-brandMuted"></i> ショートカット</button>
                            <button onclick="exportUserData();" class="flex items-center gap-2 text-xs font-bold text-brandText bg-brandSurface border border-brandBorder hover:border-brandAccent rounded-lg px-3 py-3 transition"><i data-lucide="download" class="w-4 h-4 text-brandMuted"></i> データ保存</button>
                        </div>

                        <button onclick="closeMyPage(); logout();" class="w-full mt-6 flex items-center justify-center gap-2 text-xs font-bold text-red-500 bg-red-950/20 border border-red-900/50 hover:bg-red-950/40 rounded-lg px-3 py-3.5 transition">
                            <i data-lucide="log-out" class="w-4 h-4"></i> ログアウト
                        </button>
                    </div>
                </div>
            </div>`;
        }

        function openMyPage() {
            if (!currentUser) {
                showToast("マイページはログイン後にご利用いただけます", "account");
                return;
            }
            const existing = document.getElementById('myPageModal');
            if (existing) existing.remove();

            document.body.insertAdjacentHTML('beforeend', buildMyPageHTML());
            const modal = document.getElementById('myPageModal');

            lockBodyScroll();
            lucide.createIcons();

            requestAnimationFrame(() => {
                modal.classList.remove('opacity-0', 'translate-y-3');
            });
        }

        function closeMyPage() {
            const modal = document.getElementById('myPageModal');
            if (!modal) return;
            modal.classList.add('opacity-0', 'translate-y-3');
            unlockBodyScroll();
            setTimeout(() => modal.remove(), 300);
        }

        function resetAllSettingsAndData() {
            if (!confirm("設定とデータ(履歴・お気に入り・視聴位置・設定。アカウントの「あとで見る」は消えません)をすべて初期化します。よろしいですか？")) return;
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(STORAGE_PREFIX)) keysToRemove.push(key);
            }
            keysToRemove.forEach(key => localStorage.removeItem(key));
            showToast("初期化しました。再読み込みします", "data");
            setTimeout(() => location.reload(), 1000);
        }

        function populateSettingsInputs() {
            const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
            const setChecked = (id, val) => { const el = document.getElementById(id); if (el) el.checked = !!val; };

            setVal('config-playbackRate', appConfig.playbackRate);
            setChecked('config-autoPlay', appConfig.autoPlay);
            setVal('config-defaultVolume', appConfig.defaultVolume);
            const volLabel = document.getElementById('volumeValueLabel');
            if (volLabel) volLabel.textContent = appConfig.defaultVolume;
            setChecked('config-rememberMute', appConfig.rememberMute);
            setChecked('config-loop', appConfig.loop);
            setChecked('config-autoNext', appConfig.autoNext);
            setVal('config-doubleTapSeek', appConfig.doubleTapSeek);
            setVal('config-arrowKeySeek', appConfig.arrowKeySeek);
            setVal('config-controlsHideDelay', appConfig.controlsHideDelay);
            setChecked('config-theaterModeDefault', appConfig.theaterModeDefault);
            setChecked('config-reduceMotion', appConfig.reduceMotion);
            setVal('config-defaultSortOrder', appConfig.defaultSortOrder);
            setVal('config-accentColor', appConfig.accentColor);
            setVal('config-uiScale', appConfig.uiScale);
            setVal('config-theme', appConfig.theme);
            setChecked('config-recordHistory', appConfig.recordHistory);
        }

        let currentUser = null;
        let currentUserAvatar = "";
        let currentUserDiscordId = "";
        let userWatchHistory = [];
        let userFavorites = [];
        let userResumeTimes = {};

        function displayLoginError(msgHTML) {
            const errBox = document.getElementById('loginError');
            const errText = document.getElementById('loginErrorMsg');
            const btnArea = document.getElementById('loginBtnContainer');
            const loadArea = document.getElementById('loadingArea');

            clearInterval(dotInterval);
            loadArea.classList.add('hidden');
            loadArea.classList.remove('flex');
            btnArea.classList.remove('hidden');

            errText.innerHTML = msgHTML;
            errBox.classList.remove('hidden');
            errBox.classList.add('flex');
            lucide.createIcons();
        }

        function loginWithDiscord() {
            if (!DISCORD_CONFIG["verify-url"] || !DISCORD_CONFIG["client-id"]) {
                displayLoginError('Discordの設定が読み込まれていません(discord-config-adminで保存してください)');
                return;
            }
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
            
            const loadMsg = document.getElementById('loadingMsg');
            const wait = (ms) => new Promise(r => setTimeout(r, ms));
            const setStep = async (msg) => {
                if (loadMsg) loadMsg.textContent = msg;
                await wait(300);
            };
            if (loadTextContainer) {
                loadTextContainer.classList.remove('hidden');
            }
            clearInterval(dotInterval);
            startDots();
            await setStep('DiscordのAPIを取得しています');

            window.history.replaceState({}, document.title, window.location.pathname);

            try {
                let token = accessToken;
                
                if (!token) {
                    displayLoginError('Discord認証に失敗しました');
                    return;
                }

                await setStep('ユーザー情報を取得しています');
                const userRes = await fetch('https://discord.com/api/v10/users/@me', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!userRes.ok) {
                    throw new Error('AUTH_FAILED');
                }

                const userData = await userRes.json();
                
                let avatarUrl = "";
                if (userData.avatar) {
                    avatarUrl = `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`;
                } else if (userData.id) {
                    const defaultIndex = Number(BigInt(userData.id) % 5n);
                    avatarUrl = `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png`;
                }

                await setStep('サーバーのメンバー情報を取得しています');
                const guildMemberRes = await fetch(`https://discord.com/api/v10/users/@me/guilds/${DISCORD_CONFIG["server-id"]}/member`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!guildMemberRes.ok) {
                    displayLoginError(`ロールを所持していません<br><a href="${DISCORD_CONFIG["invite-url"]}" target="_blank" class="underline font-bold text-amber-400">${DISCORD_CONFIG["invite-url"]}</a> でロールを購入してください`);
                    return;
                }

                const memberData = await guildMemberRes.json();
                await setStep('ロールを確認しています');
                const hasRole = memberData.roles && memberData.roles.some(role => String(role) === String(DISCORD_CONFIG["role-id"]));

                if (hasRole) {
                    await setStep('ログイン情報を保存しています');
                    clearInterval(dotInterval);
                    const discordUsername = userData.global_name || userData.username || "DiscordUser";
                    setStoredData('session_user', discordUsername);
                    setStoredData('session_avatar', avatarUrl);
                    setStoredData('session_token', token);
                    setStoredData('session_discord_id', userData.id || '');
                    setStoredData('session_token_checked_at', Date.now());
                    if (userData.id) setStoredData('session_account_key', 'dc_' + userData.id);
                    applyLoginState(discordUsername, avatarUrl, userData.id || '');
                } else {
                    displayLoginError(`ロールを所持していません<br><a href="${DISCORD_CONFIG["invite-url"]}" target="_blank" class="underline font-bold text-amber-400">${DISCORD_CONFIG["invite-url"]}</a> でロールを購入してください`);
                }
            } catch (err) {
                displayLoginError('Discord認証に失敗しました');
            }
        }

        function initApp() {
            updateMediaSession();
            capturePendingLink();
            injectNewUi();
            lucide.createIcons();
            applyStartupConfig();
            
            handleDiscordCallback();

            const savedUser = getStoredData('session_user', null);
            const savedAvatar = getStoredData('session_avatar', null);
            const savedDiscordId = getStoredData('session_discord_id', '');
            if (savedUser) {
                applyLoginState(savedUser, savedAvatar, savedDiscordId);
                verifyDiscordRoleOrKick();
            }
            setupKeyboardShortcuts();
            setupDoubleTapGestures();
            setupAutoFadeControls();
            setupImageSwipeEvents();
            window.addEventListener('hashchange', updateAddVideoButtonVisibility);
        }


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

            const authBase = String(AUTH_SERVER_URL || '').trim().replace(/\/+$/, '');
            if (!authBase) {
                clearInterval(dotInterval);
                displayLoginError('認証サーバーのURLが設定されていません(auth-server-url-adminで保存してください)');
                return;
            }

            try {
                const controller = new AbortController();
                const timer = setTimeout(() => controller.abort(), 60000);
                const res = await fetch(authBase + '/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        siteId: window.APP_UNIQUE_ID,
                        username: userInp.value,
                        password: passInp.value
                    }),
                    signal: controller.signal
                });
                clearTimeout(timer);
                let data = null;
                try { data = await res.json(); } catch (e) { data = null; }
                clearInterval(dotInterval);

                if (data && data.success) {
                    try {
                        setStoredData('session_account_key', await accountKeyFromCredentials(data.username || userInp.value, passInp.value));
                    } catch (e) {}
                    setStoredData('session_user', data.username);
                    setStoredData('session_avatar', "");
                    applyLoginState(data.username, "");
                } else if (data) {
                    userInp.value = ""; passInp.value = "";
                    displayLoginError(res.status === 429 ? '試行回数が多すぎます。1分ほど待ってからもう一度お試しください' : '認証に失敗しました');
                } else {
                    displayLoginError('サーバーの応答が不正です(HTTP ' + res.status + ')。認証サーバーのURLを確認してください');
                }
            } catch (err) {
                clearInterval(dotInterval);
                userInp.value = ""; passInp.value = "";
                displayLoginError('サーバーに接続できませんでした(サーバー停止中、またはALLOWED_ORIGINSにこのサイトのURLが無い可能性があります)');
            }
        }

        function applyLoginState(username, avatarUrl, discordId) {
            currentUser = username;
            currentUserAvatar = avatarUrl || getStoredData('session_avatar', '');
            currentUserDiscordId = discordId || getStoredData('session_discord_id', '');
            
            userWatchHistory = getStoredData('history_' + currentUser, []);
            userFavorites = getStoredData('favorites_' + currentUser, []);
            userResumeTimes = getStoredData('resumes_' + currentUser, {});

            window.currentUser = currentUser;
            window.currentUserDiscordId = currentUserDiscordId;
            updateAddVideoButtonVisibility();
            
            if (window.db && window.getAuthUser && window.getAuthUser()) {
                syncUserDataFromCloud(); 
            }

            document.getElementById('headerUsername').textContent = username;
            
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
            initVideosFromFirestore();
            loadSavesForAccount();
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
                    if (data.resumeTimes) userResumeTimes = data.resumeTimes;
                    
                    setStoredData('history_' + currentUser, userWatchHistory);
                    setStoredData('favorites_' + currentUser, userFavorites);
                    setStoredData('resumes_' + currentUser, userResumeTimes);

                    updateFavoriteBtnUI();
                    renderPlaylist();
                } else {
                    saveUserDataToCloud();
                }
            } catch (err) {}
        }

        async function saveUserDataToCloud() {
            if (!currentUser) return;
            setStoredData('history_' + currentUser, userWatchHistory);
            setStoredData('favorites_' + currentUser, userFavorites);
            setStoredData('resumes_' + currentUser, userResumeTimes);

            const authUser = window.getAuthUser ? window.getAuthUser() : null;
            if (!window.db || !authUser) return;

            try {
                const docRef = window.doc(window.db, 'artifacts', window.appId, 'users', authUser.uid, 'userData', currentUser);
                await window.setDoc(docRef, {
                    username: currentUser,
                    history: userWatchHistory,
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

        function logout(silent) {
            // 1) 先に画面を切り替える(以降の処理で何かが失敗しても即ログイン画面になる)
            try {
                const mc = document.getElementById('mainContent');
                mc.classList.add('hidden'); mc.classList.remove('flex');
                const ls = document.getElementById('loginScreen');
                ls.classList.remove('hidden'); ls.classList.add('flex');
                document.getElementById('userMenuDropdown').classList.add('hidden');
                document.getElementById('loadingArea').classList.add('hidden');
                document.getElementById('loadingArea').classList.remove('flex');
                document.getElementById('loginBtnContainer').classList.remove('hidden');
                document.getElementById('loginError').classList.add('hidden');
                document.getElementById('userId').value = "";
                document.getElementById('userPwd').value = "";
            } catch (e) {}

            // 2) セッション削除
            try {
                localStorage.removeItem(STORAGE_PREFIX + 'session_user');
                localStorage.removeItem(STORAGE_PREFIX + 'session_avatar');
                localStorage.removeItem(STORAGE_PREFIX + 'session_token');
                localStorage.removeItem(STORAGE_PREFIX + 'session_token_checked_at');
                localStorage.removeItem(STORAGE_PREFIX + 'session_discord_id');
                localStorage.removeItem(STORAGE_PREFIX + 'session_account_key');
            } catch (e) {}

            currentUser = null;
            currentUserAvatar = "";
            currentUserDiscordId = "";
            window.currentUser = null;
            window.currentUserDiscordId = null;
            userWatchHistory = [];
            userFavorites = [];
            userSaved = [];
            savesReady = false;
            userResumeTimes = {};

            // 3) 後始末(失敗しても無視)
            try { clearInterval(dotInterval); } catch (e) {}
            try { closeUserMenu(); } catch (e) {}
            try { const rm = document.getElementById('resumeModal'); if (rm) rm.classList.add('hidden'); } catch (e) {}
            try { unlockBodyScroll(); } catch (e) {}
            try {
                if (player) {
                    player.pause();
                    player.removeAttribute('src');
                    if (playerSrc) playerSrc.removeAttribute('src');
                    player.load();
                }
            } catch (e) {}
            try {
                const userMenuBtn = document.getElementById('userMenuBtn');
                if (userMenuBtn) {
                    userMenuBtn.innerHTML = `<i data-lucide="user" class="w-5 h-5 sm:w-6 sm:h-6 pointer-events-none"></i>`;
                    lucide.createIcons();
                }
            } catch (e) {}

            if (silent !== true) { try { showToast("ログアウトしました", "account"); } catch (e) {} }
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
            lockBodyScroll();
            lucide.createIcons();
        }

        function closeHistoryModal() {
            document.getElementById('historyModal').classList.add('hidden');
            unlockBodyScroll();
        }

        function clearHistory() {
            if (!currentUser) return;
            userWatchHistory = [];
            saveUserDataToCloud();
            openHistoryModal();
            showToast("視聴履歴を消去しました", "historyClear");
        }

        function toggleFavorite() {
            if (!currentUser) return;
            const index = userFavorites.indexOf(activeId);
            if (index >= 0) {
                userFavorites.splice(index, 1);
                showToast("お気に入りから削除しました", "watchLater");
            } else {
                userFavorites.push(activeId);
                showToast("お気に入りに追加しました", "watchLater");
            }
            setStoredData('favorites_' + currentUser, userFavorites);
            updateFavoriteBtnUI();
            renderPlaylist();
        }

        function updateFavoriteBtnUI() {
            const btn = document.getElementById('favoriteBtn');
            if (!btn) return;
            const on = userFavorites.includes(activeId);
            btn.innerHTML = `<i data-lucide="heart" class="w-5 h-5 text-rose-400 ${on ? 'fill-rose-400' : 'fill-transparent'}"></i>`;
            lucide.createIcons();
        }

        function openFavoritesModal() {
            const container = document.getElementById('favoritesListContainer');
            container.innerHTML = "";
            const items = userFavorites.map(id => videos.find(video => video.id === id)).filter(Boolean);
            if (items.length === 0) {
                container.innerHTML = `<p class="text-xs text-brandMuted text-center py-8">お気に入りはまだありません</p>`;
            } else {
                items.forEach(v => {
                    const el = document.createElement('div');
                    el.className = "flex items-center justify-between p-3 bg-brandBg rounded-xl border border-brandBorder";
                    el.innerHTML = `
                        <div class="flex items-center gap-3 min-w-0 cursor-pointer flex-grow" onclick="loadMedia(${v.id}); closeFavoritesModal();">
                            <img src="${v.thumbnail}" class="w-16 h-10 object-contain bg-black rounded border border-brandBorder flex-shrink-0">
                            <div class="min-w-0">
                                <p class="text-xs font-bold text-brandText truncate">${v.title}</p>
                                <p class="text-[10px] text-brandMuted">${v.duration}</p>
                            </div>
                        </div>
                        <button onclick="removeFromFavorites(${v.id}, event)" class="p-2 text-brandMuted hover:text-red-500 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    `;
                    container.appendChild(el);
                });
            }
            document.getElementById('favoritesModal').classList.remove('hidden');
            lockBodyScroll();
            lucide.createIcons();
        }

        function removeFromFavorites(id, e) {
            if (e) e.stopPropagation();
            if (!currentUser) return;
            const index = userFavorites.indexOf(id);
            if (index >= 0) {
                userFavorites.splice(index, 1);
                setStoredData('favorites_' + currentUser, userFavorites);
                openFavoritesModal();
                updateFavoriteBtnUI();
                renderPlaylist();
                showToast("お気に入りから削除しました", "watchLater");
            }
        }

        function closeFavoritesModal() {
            document.getElementById('favoritesModal').classList.add('hidden');
            unlockBodyScroll();
        }

        const SAVES_PROJECT_ID = 'likes-and-saves';
        const SAVES_API_KEY = 'AIzaSyDPxlr5-fCoWrHrwk61DmzW-iYmCPnEKHk';
        const SAVES_BASE = 'https://firestore.googleapis.com/v1/projects/' + SAVES_PROJECT_ID + '/databases/(default)/documents/userSaves';
        let userSaved = [];
        let savesReady = false;
        let savePending = false;

        async function sha256Hex(text) {
            try {
                if (window.crypto && window.crypto.subtle) {
                    const buf = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
                    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
                }
            } catch (e) {}
            let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
            for (let i = 0; i < text.length; i++) {
                const ch = text.charCodeAt(i);
                h1 = Math.imul(h1 ^ ch, 2654435761);
                h2 = Math.imul(h2 ^ ch, 1597334677);
            }
            h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
            h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
            return (h2 >>> 0).toString(16).padStart(8, '0') + (h1 >>> 0).toString(16).padStart(8, '0');
        }

        async function accountKeyFromCredentials(username, password) {
            return 'pw_' + await sha256Hex(username + '\n' + password);
        }

        function currentAccountKey() {
            const k = getStoredData('session_account_key', '');
            if (k) return k;
            if (currentUserDiscordId) return 'dc_' + currentUserDiscordId;
            return '';
        }

        function savesDocId() {
            const k = currentAccountKey();
            return k ? (window.APP_UNIQUE_ID + '__' + k) : '';
        }

        async function savesFetch(url, options) {
            const ctrl = new AbortController();
            const timer = setTimeout(() => ctrl.abort(), 12000);
            try {
                return await fetch(url, Object.assign({}, options || {}, { signal: ctrl.signal }));
            } finally {
                clearTimeout(timer);
            }
        }

        async function fetchSavedFromCloud() {
            const id = savesDocId();
            if (!id) return null;
            const res = await savesFetch(SAVES_BASE + '/' + encodeURIComponent(id) + '?key=' + SAVES_API_KEY);
            if (res.status === 404) return [];
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const json = await res.json();
            const vals = (json.fields && json.fields.saved && json.fields.saved.arrayValue && json.fields.saved.arrayValue.values) || [];
            return vals.map(v => parseInt(v.integerValue, 10)).filter(n => Number.isInteger(n));
        }

        async function pushSavedToCloud(list) {
            const id = savesDocId();
            if (!id) throw new Error('アカウント未確認');
            const body = {
                fields: {
                    saved: { arrayValue: { values: list.map(n => ({ integerValue: String(n) })) } },
                    updatedAt: { timestampValue: new Date().toISOString() }
                }
            };
            const res = await savesFetch(
                SAVES_BASE + '/' + encodeURIComponent(id) + '?updateMask.fieldPaths=saved&updateMask.fieldPaths=updatedAt&key=' + SAVES_API_KEY,
                { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
            );
            if (!res.ok) throw new Error('HTTP ' + res.status);
        }

        async function loadSavesForAccount() {
            userSaved = [];
            savesReady = false;
            updateSaveBtnUI();
            if (!currentAccountKey()) return;
            const user = currentUser;
            try {
                const list = await fetchSavedFromCloud();
                if (currentUser !== user) return;
                userSaved = list || [];
                savesReady = true;
                try {
                    const legacy = getStoredData('watchlater_' + user, []);
                    if (Array.isArray(legacy) && legacy.length > 0) {
                        const merged = userSaved.slice();
                        legacy.forEach(id => { if (Number.isInteger(id) && !merged.includes(id)) merged.push(id); });
                        if (merged.length !== userSaved.length) await pushSavedToCloud(merged);
                        userSaved = merged;
                        localStorage.removeItem(STORAGE_PREFIX + 'watchlater_' + user);
                    }
                } catch (e) {}
            } catch (e) {
                savesReady = false;
            }
            updateSaveBtnUI();
            renderPlaylist();
        }

        async function toggleSave() {
            if (!currentUser) return;
            if (!currentAccountKey()) {
                showToast("「あとで見る」を使うには、一度ログアウトしてもう一度ログインしてください", "system");
                return;
            }
            if (savePending) return;
            if (!savesReady) {
                await loadSavesForAccount();
                if (!savesReady) {
                    showToast("サーバーに接続できませんでした", "system");
                    return;
                }
            }
            savePending = true;
            const prev = userSaved.slice();
            const index = userSaved.indexOf(activeId);
            if (index >= 0) userSaved.splice(index, 1); else userSaved.push(activeId);
            updateSaveBtnUI();
            renderPlaylist();
            try {
                await pushSavedToCloud(userSaved);
                showToast(index >= 0 ? "「あとで見る」から削除しました" : "「あとで見る」に追加しました", "watchLater");
            } catch (e) {
                userSaved = prev;
                updateSaveBtnUI();
                renderPlaylist();
                showToast("「あとで見る」の更新に失敗しました (" + (e && e.message ? e.message : '通信エラー') + ")", "system");
            } finally {
                savePending = false;
            }
        }

        function updateSaveBtnUI() {
            const btn = document.getElementById('saveBtn');
            if (!btn) return;
            const on = userSaved.includes(activeId);
            btn.innerHTML = `<i data-lucide="bookmark" class="w-5 h-5 text-amber-400 ${on ? 'fill-amber-400' : 'fill-transparent'}"></i>`;
            lucide.createIcons();
        }

        async function openSavesModal() {
            const container = document.getElementById('savesListContainer');
            document.getElementById('savesModal').classList.remove('hidden');
            lockBodyScroll();
            if (!currentAccountKey()) {
                container.innerHTML = `<p class="text-xs text-brandMuted text-center py-8">「あとで見る」を使うには、一度ログアウトしてもう一度ログインしてください</p>`;
                return;
            }
            if (!savesReady) {
                container.innerHTML = `<p class="text-xs text-brandMuted text-center py-8">読み込み中</p>`;
                await loadSavesForAccount();
            }
            renderSavesList();
        }

        function renderSavesList() {
            const container = document.getElementById('savesListContainer');
            if (!container) return;
            container.innerHTML = "";
            if (!savesReady) {
                container.innerHTML = `<p class="text-xs text-brandMuted text-center py-8">サーバーに接続できませんでした</p>`;
                return;
            }
            const items = userSaved.map(id => videos.find(video => video.id === id)).filter(Boolean);
            if (items.length === 0) {
                container.innerHTML = `<p class="text-xs text-brandMuted text-center py-8">「あとで見る」リストは空です</p>`;
            } else {
                items.forEach(v => {
                    const el = document.createElement('div');
                    el.className = "flex items-center justify-between p-3 bg-brandBg rounded-xl border border-brandBorder";
                    el.innerHTML = `
                        <div class="flex items-center gap-3 min-w-0 cursor-pointer flex-grow" onclick="loadMedia(${v.id}); closeSavesModal();">
                            <img src="${v.thumbnail}" class="w-16 h-10 object-contain bg-black rounded border border-brandBorder flex-shrink-0">
                            <div class="min-w-0">
                                <p class="text-xs font-bold text-brandText truncate">${v.title}</p>
                                <p class="text-[10px] text-brandMuted">${v.duration}</p>
                            </div>
                        </div>
                        <button onclick="removeFromSaves(${v.id}, event)" class="p-2 text-brandMuted hover:text-red-500 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    `;
                    container.appendChild(el);
                });
            }
            lucide.createIcons();
        }

        async function removeFromSaves(id, e) {
            if (e) e.stopPropagation();
            if (!savesReady || savePending) return;
            const index = userSaved.indexOf(id);
            if (index < 0) return;
            savePending = true;
            const prev = userSaved.slice();
            userSaved.splice(index, 1);
            renderSavesList();
            updateSaveBtnUI();
            renderPlaylist();
            try {
                await pushSavedToCloud(userSaved);
                showToast("「あとで見る」から削除しました", "watchLater");
            } catch (err) {
                userSaved = prev;
                renderSavesList();
                updateSaveBtnUI();
                renderPlaylist();
                showToast("「あとで見る」からの削除に失敗しました", "system");
            } finally {
                savePending = false;
            }
        }

        function closeSavesModal() {
            document.getElementById('savesModal').classList.add('hidden');
            unlockBodyScroll();
        }

        function updateMediaSession() {
            try {
                if (!('mediaSession' in navigator) || typeof MediaMetadata === 'undefined') return;
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: document.title,
                    artwork: [
                        { src: 'https://pub-79a6c6cc78c146739a6140aee2f59bc2.r2.dev/Image/apple-touch-icon_a0d5f87d.png', sizes: '180x180', type: 'image/png' },
                        { src: 'https://pub-79a6c6cc78c146739a6140aee2f59bc2.r2.dev/Image/artwork-512_9c88b02a.png', sizes: '512x512', type: 'image/png' }
                    ]
                });
            } catch (e) {}
        }

        function playRandom() {
            const pool = videos.filter(v => {
                if (v.id === activeId) return false;
                if (!searchQuery) return true;
                return (v.title || '').toLowerCase().includes(searchQuery)
                    || (v.desc || '').toLowerCase().includes(searchQuery)
                    || (v.date || '').includes(searchQuery);
            });
            if (pool.length === 0) {
                showToast("ほかに再生できる動画がありません", "autoNext");
                return;
            }
            const pick = pool[Math.floor(Math.random() * pool.length)];
            showToast("ランダム再生", "autoNext");
            loadMedia(pick.id);
            const box = document.getElementById('videoContainer');
            if (box && box.scrollIntoView) box.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        const PENDING_LINK_KEY = 'pending_link';
        let linkSeek = null;
        let linkSeekTimer = null;
        let linkSeekToasted = false;

        function capturePendingLink() {
            try {
                const params = new URLSearchParams(window.location.search);
                const v = parseInt(params.get('v'));
                if (!Number.isInteger(v) || v <= 0) return;
                const t = parseFloat(params.get('t'));
                setStoredData(PENDING_LINK_KEY, { v: v, t: (isFinite(t) && t > 0) ? Math.floor(t) : 0, ts: Date.now() });
            } catch (e) {}
        }

        function consumePendingLink() {
            const p = getStoredData(PENDING_LINK_KEY, null);
            try { localStorage.removeItem(STORAGE_PREFIX + PENDING_LINK_KEY); } catch (e) {}
            if (!p || !p.v || (Date.now() - p.ts) > 60 * 60 * 1000) return null;
            return p;
        }

        function linkifyTimestamps(line) {
            return line.replace(/(^|[\s(（\[【「>])(\d{1,2}:\d{2}(?::\d{2})?)(?![\d:])/g, (m, pre, ts) => {
                const parts = ts.split(':').map(Number);
                if (parts.slice(1).some(n => n >= 60)) return m;
                const sec = parts.length === 3 ? parts[0] * 3600 + parts[1] * 60 + parts[2] : parts[0] * 60 + parts[1];
                return `${pre}<span class="ts-link" data-t="${sec}">${ts}</span>`;
            });
        }

        const EXTRA_CSS = `
            .gauge { position: relative; width: min(130px, 40vw); height: 3px; border-radius: 999px; background: var(--border-color); overflow: hidden; }
            .gauge-bar { position: absolute; top: 0; left: 0; height: 100%; width: 30%; background: linear-gradient(90deg, rgba(234,88,12,0) 0%, #ea580c 35%, #ea580c 65%, rgba(234,88,12,0) 100%); animation: gauge-slide 1.4s ease-in-out infinite alternate; }
            @keyframes gauge-slide { from { transform: translateX(0); } to { transform: translateX(233.34%); } }
            .ts-link { color: var(--accent); font-weight: 700; cursor: pointer; text-decoration: underline; text-underline-offset: 3px; }
            html[data-theme="light"] { --bg-main: #f4f4f5; --bg-surface: #ffffff; --text-main: #18181b; --text-muted: #71717a; --border-color: #d4d4d8; --header-bg: #ffffff; color-scheme: light; }
        `;

        function injectNewUi() {
            if (document.getElementById('extraUiStyle')) return;

            const style = document.createElement('style');
            style.id = 'extraUiStyle';
            style.textContent = EXTRA_CSS;
            document.head.appendChild(style);

            if (window.matchMedia) {
                const mq = window.matchMedia('(prefers-color-scheme: light)');
                const onChange = () => { if (appConfig.theme === 'auto') applyTheme('auto'); };
                if (mq.addEventListener) mq.addEventListener('change', onChange);
                else if (mq.addListener) mq.addListener(onChange);
            }

            document.addEventListener('click', (e) => {
                const el = e.target && e.target.closest ? e.target.closest('.ts-link') : null;
                if (!el) return;
                e.stopPropagation();
                const sec = parseInt(el.getAttribute('data-t'), 10);
                const cur = videos.find(x => x.id === activeId);
                if (!cur || cur.type === 'image' || cur.images || !player || !isFinite(sec)) return;
                const d = player.duration;
                player.currentTime = (isFinite(d) && sec > d) ? Math.max(0, d - 1) : sec;
                if (player.paused) player.play().catch(() => {});
                const box = document.getElementById('videoContainer');
                if (box && box.scrollIntoView) box.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });

            lucide.createIcons();
        }

        function showShortcutsModal() {
            document.getElementById('shortcutsModal').classList.remove('hidden');
            lockBodyScroll();
        }
        function closeShortcutsModal() {
            document.getElementById('shortcutsModal').classList.add('hidden');
            unlockBodyScroll();
        }

        function openSettings() {
            const modal = document.getElementById('settingsModal');
            const wrapper = document.getElementById('settingsModalScaleWrapper');
            populateSettingsInputs();
            lockBodyScroll();
            modal.classList.remove('hidden');
            setTimeout(() => {
                modal.classList.remove('opacity-0');
                wrapper.classList.remove('scale-95'); wrapper.classList.add('scale-100');
            }, 10);
        }
        function closeSettings() {
            const modal = document.getElementById('settingsModal');
            const wrapper = document.getElementById('settingsModalScaleWrapper');
            modal.classList.add('opacity-0');
            wrapper.classList.remove('scale-100'); wrapper.classList.add('scale-95');
            setTimeout(() => modal.classList.add('hidden'), 300);
            unlockBodyScroll();
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

        // Firestoreの本物のデータが届くまでは空のまま。
        // config.jsのvideosDataは、Firebaseが使えない時だけの最終フォールバックとして扱う。
        let videos = [];

        function getVideosCollectionRef() {
            if (!window.db || !window.firestoreFns) return null;
            return window.firestoreFns.collection(window.db, 'sites', window.APP_UNIQUE_ID, 'videos');
        }

        function showVideoLoadStatus(msg) {
            const pl = document.getElementById('playlist');
            if (!pl || videos.length > 0) return;
            pl.innerHTML = '<div class="p-4 text-center text-xs text-brandMuted leading-relaxed">' + msg +
                '<br><button onclick="retryLoadVideos()" class="mt-3 px-4 py-2 rounded-full border border-brandBorder text-brandAccent font-bold">再取得</button></div>';
        }

        // SDKが固まる環境(iPhone Safari等)向け: 公開読み取りのREST APIで直接取得する
        async function loadVideosViaRest() {
            const unwrap = (v) => {
                if (v == null) return null;
                if ('stringValue' in v) return v.stringValue;
                if ('integerValue' in v) return parseInt(v.integerValue, 10);
                if ('doubleValue' in v) return v.doubleValue;
                if ('booleanValue' in v) return v.booleanValue;
                if ('timestampValue' in v) return v.timestampValue;
                if ('mapValue' in v) { const o = {}; const f = (v.mapValue && v.mapValue.fields) || {}; for (const k in f) o[k] = unwrap(f[k]); return o; }
                if ('arrayValue' in v) return ((v.arrayValue && v.arrayValue.values) || []).map(unwrap);
                return null;
            };
            const base = 'https://firestore.googleapis.com/v1/projects/gvn-org-cloud/databases/(default)/documents/sites/' +
                encodeURIComponent(window.APP_UNIQUE_ID) + '/videos';
            const out = [];
            let pageToken = '';
            do {
                const ctrl = new AbortController();
                const t = setTimeout(() => ctrl.abort(), 15000);
                const res = await fetch(base + '?pageSize=300' + (pageToken ? '&pageToken=' + encodeURIComponent(pageToken) : ''), { signal: ctrl.signal });
                clearTimeout(t);
                if (!res.ok) throw new Error('HTTP ' + res.status);
                const json = await res.json();
                (json.documents || []).forEach(d => {
                    const o = {}; const f = d.fields || {};
                    for (const k in f) o[k] = unwrap(f[k]);
                    o._docId = d.name.split('/').pop();
                    out.push(o);
                });
                pageToken = json.nextPageToken || '';
            } while (pageToken);
            out.sort((a, b) => (a.id || 0) - (b.id || 0));
            return out;
        }

        let videoRestRunning = false;
        async function fallbackLoadVideos() {
            if (videos.length > 0 || videoRestRunning) return;
            videoRestRunning = true;
            try {
                const docs = await loadVideosViaRest();
                if (docs.length > 0 && videos.length === 0) {
                    videos = docs;
                    renderPlaylist();
                } else if (docs.length === 0 && videos.length === 0) {
                    showVideoLoadStatus('動画が見つかりませんでした(このサイトIDの動画が未登録の可能性があります)');
                }
            } catch (err) {
                showVideoLoadStatus('動画を取得できませんでした(' + (err && err.message ? err.message : '通信エラー') + ')');
            }
            videoRestRunning = false;
        }

        function retryLoadVideos() {
            videoRestRunning = false;
            fallbackLoadVideos();
            initVideosFromFirestore();
        }

        let videosSubscribed = false;
        async function initVideosFromFirestore() {
            // 5秒たっても動画が届かなければRESTで取得する(SDKの待ちとは並行して動く)
            setTimeout(() => { if (videos.length === 0) fallbackLoadVideos(); }, 5000);

            const readyOrTimeout = await Promise.race([
                window.firestoreReady.then(() => true),
                new Promise(r => setTimeout(() => r(false), 8000))
            ]);
            if (!readyOrTimeout || !window.db || !window.firestoreFns) {
                if (typeof videosData !== 'undefined' && Array.isArray(videosData) && videosData.length > 0 && videos.length === 0) {
                    videos = videosData.slice();
                    renderPlaylist();
                }
                fallbackLoadVideos();
                return;
            }
            if (videosSubscribed) return;
            videosSubscribed = true;

            const { query, orderBy, onSnapshot, getDocs, addDoc, serverTimestamp } = window.firestoreFns;
            const videosRef = getVideosCollectionRef();
            const q = query(videosRef, orderBy('id', 'asc'));

            try {
                const snapshot = await Promise.race([
                    getDocs(q),
                    new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 8000))
                ]);
                if (snapshot.empty && typeof videosData !== 'undefined' && Array.isArray(videosData) && videosData.length > 0) {
                    for (const v of videosData) {
                        await addDoc(videosRef, { ...v, createdAt: serverTimestamp() });
                    }
                }
            } catch (err) {
                console.error('Firestore初期取得エラー:', err);
                fallbackLoadVideos();
            }

            onSnapshot(q, (snap) => {
                const docs = [];
                snap.forEach(d => docs.push({ ...d.data(), _docId: d.id }));
                if (docs.length > 0) {
                    videos = docs;
                    renderPlaylist();
                }
            }, (err) => {
                console.error('Firestore購読エラー:', err);
                videosSubscribed = false;
                fallbackLoadVideos();
            });
        }

        function isAdmin() {
            return typeof ADMIN_DISCORD_IDS !== 'undefined' && Array.isArray(ADMIN_DISCORD_IDS) && !!currentUserDiscordId && ADMIN_DISCORD_IDS.includes(currentUserDiscordId);
        }

        const ADMIN_URL_HASH = '#qz8f2mx91kd';

        function updateAddVideoButtonVisibility() {
            const btn = document.getElementById('addVideoBtn');
            if (!btn) return;
            const hashMatches = window.location.hash === ADMIN_URL_HASH;
            btn.classList.toggle('hidden', !(isAdmin() && hashMatches));
        }

        function openAddVideoModal() {
            if (!isAdmin()) return;
            document.getElementById('addVideoForm').reset();
            toggleAddVideoFields();
            document.getElementById('addVideoModal').classList.remove('hidden');
        }

        function closeAddVideoModal() {
            document.getElementById('addVideoModal').classList.add('hidden');
        }

        function toggleAddVideoFields() {
            const isImage = document.getElementById('addVideoType').value === 'image';
            document.getElementById('addVideoUrlField').classList.toggle('hidden', isImage);
            document.getElementById('addVideoImagesField').classList.toggle('hidden', !isImage);
        }

        async function submitAddVideo(event) {
            event.preventDefault();
            if (!isAdmin()) return;

            const videosRef = getVideosCollectionRef();
            if (!videosRef || !window.firestoreFns) {
                showToast('データベースに接続できていません', 'system');
                return;
            }

            const type = document.getElementById('addVideoType').value;
            const nextId = videos.length > 0 ? Math.max(...videos.map(v => v.id || 0)) + 1 : 1;

            const newVideo = {
                id: nextId,
                type,
                title: document.getElementById('addVideoTitle').value.trim(),
                thumbnail: document.getElementById('addVideoThumbnail').value.trim(),
                duration: document.getElementById('addVideoDuration').value.trim(),
                date: document.getElementById('addVideoDate').value.trim(),
                desc: document.getElementById('addVideoDesc').value.trim()
            };

            if (type === 'image') {
                newVideo.images = document.getElementById('addVideoImages').value
                    .split('\n')
                    .map(s => s.trim())
                    .filter(s => s.length > 0);
            } else {
                newVideo.url = document.getElementById('addVideoUrl').value.trim();
            }

            try {
                await window.firestoreFns.addDoc(videosRef, { ...newVideo, createdAt: window.firestoreFns.serverTimestamp() });
                closeAddVideoModal();
                showToast('追加しました', 'system');
            } catch (err) {
                console.error('動画追加エラー:', err);
                showToast('追加に失敗しました', 'system');
            }
        }

        let activeId = 1;
        let hasLoadedInitialMedia = false;
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

        function forceLoadIdOneUntilReady() {
            const intervalMs = 500;
            const burstIntervalMs = 10;
            const burstDurationMs = 100;

            const attemptLoad = () => {
                const originalAutoPlay = appConfig.autoPlay;
                appConfig.autoPlay = false;
                loadMedia(activeId);
                appConfig.autoPlay = originalAutoPlay;
            };


            // 届くまでは無期限に試行し続ける
            let missTicks = 0;
            const timer = setInterval(() => {
                const found = videos.some(v => v.id === activeId);
                if (!found) {
                    missTicks = videos.length > 0 ? missTicks + 1 : 0;
                    if (missTicks >= 4) { activeId = videos[0].id; linkSeek = null; missTicks = 0; }
                    return;
                }

                attemptLoad();
                hasLoadedInitialMedia = true;
                clearInterval(timer);

                // 届いた直後の0.1秒だけ、0.01秒間隔で念押しに再読み込みする
                let burstElapsed = 0;
                const burstTimer = setInterval(() => {
                    attemptLoad();
                    burstElapsed += burstIntervalMs;
                    if (burstElapsed >= burstDurationMs) clearInterval(burstTimer);
                }, burstIntervalMs);
            }, intervalMs);
        }

        function initPlayer() {
            const params = new URLSearchParams(window.location.search);
            const vParam = parseInt(params.get('v'));
            // この時点ではvideosがまだ空(Firestore読み込み前)のことがあるので、
            // 存在チェックはせず数値として有効なら採用する。実際に存在するかはforceLoadIdOneUntilReady側で判定される。
            activeId = (Number.isInteger(vParam) && vParam > 0) ? vParam : 1;
            const pending = consumePendingLink();
            if (pending) {
                activeId = pending.v;
                if (pending.t > 0) linkSeek = { id: pending.v, t: pending.t };
                try {
                    const u = new URL(window.location.href);
                    u.searchParams.set('v', pending.v);
                    u.searchParams.delete('t');
                    history.replaceState(null, '', u.toString());
                } catch (e) {}
            }

            forceLoadIdOneUntilReady();

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
                return linkifyTimestamps(line);
            }).join('<br>');
        }

        function filterByTagText(tagText) {
            const input = document.getElementById("searchInput");
            input.value = tagText;
            handleSearch();
        }

        const ROLE_CHECK_CACHE_MS = 5 * 60 * 1000; // 5分間は再チェックをスキップ

        async function verifyDiscordRoleOrKick() {
            const token = getStoredData('session_token', null);
            if (!token) return true; // ID/PWログインなどDiscordセッションがない場合はチェック対象外

            const lastChecked = getStoredData('session_token_checked_at', 0);
            if (Date.now() - lastChecked < ROLE_CHECK_CACHE_MS) return true; // 直近確認済みならAPIを叩かない

            try {
                const guildMemberRes = await fetch(`https://discord.com/api/v10/users/@me/guilds/${DISCORD_CONFIG["server-id"]}/member`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!guildMemberRes.ok) {
                    showRoleLostOverlay();
                    return false;
                }

                const memberData = await guildMemberRes.json();
                const hasRole = memberData.roles && memberData.roles.some(role => String(role) === String(DISCORD_CONFIG["role-id"]));

                if (!hasRole) {
                    showRoleLostOverlay();
                    return false;
                }
                setStoredData('session_token_checked_at', Date.now());
                return true;
            } catch (err) {
                console.error('ロール確認エラー:', err);
                return true; // ネットワークエラー時は誤ログアウトを避けるため通す
            }
        }

        function showRoleLostOverlay() {
            if (document.getElementById('roleLostOverlay')) return;

            if (player) player.pause();

            const overlay = document.createElement('div');
            overlay.id = 'roleLostOverlay';
            overlay.className = 'fixed inset-0 z-[999] bg-black/95 flex overflow-y-auto px-6 py-10';
            overlay.innerHTML = `
                <div class="max-w-xl m-auto text-center">
                    <p class="font-bold text-xl mb-5" style="color:#ff0000;">ロールを持っていません</p>
                    <p class="text-brandMuted text-sm leading-loose">このアカウントには、当サイトのコンテンツを閲覧するために必要なDiscordロールが現在付与されていないことが確認されました。ロールが外れてしまった場合や、購入や付与の手続きがまだ完了していない場合、あるいはDiscordサーバーから退出してしまっている場合など、いくつかの原因が考えられますが、いずれの場合であっても、このまま閲覧を続けることはできません。セキュリティ保護のため、このメッセージが表示されてから5秒後にあなたのアカウントは自動的にログアウトされ、この端末に保存されていたログイン情報やセッションもすべて削除されます。再びご利用いただくには、Discordサーバーで必要なロールを取得したうえで、もう一度ログインし直してください。それでは、またのご利用を心よりお待ちしております。</p>
                </div>
            `;
            document.body.appendChild(overlay);

            setTimeout(() => {
                overlay.remove();
                logout(true);
                showRoleLostNotice();
            }, 5000);
        }

        function showRoleLostNotice() {
            const wrap = document.createElement('div');
            wrap.id = 'roleLostNoticeWrap';
            wrap.className = 'fixed inset-0 z-[1000] flex items-center justify-center pointer-events-none px-6';
            wrap.innerHTML = `
                <div id="roleLostNotice" class="border-2 border-red-500 rounded-xl px-6 py-4 bg-black/80 text-center">
                    <p class="text-red-400 font-bold text-base">ロールを持っていません</p>
                </div>
            `;
            document.body.appendChild(wrap);
            setTimeout(() => wrap.remove(), 3100);
        }

        function loadMedia(id) {
            const v = videos.find(item => item.id === id);
            if (!v) {
                return;
            }
            activeId = id;
            
            vTitle.textContent = v.title;
            vDate.textContent = `公開日: ${v.date}`;
            vDesc.innerHTML = formatHashtags(v.desc);
            renderPlaylist();
            updateFavoriteBtnUI();
            updateSaveBtnUI();
            updateMediaSession();
            if (appConfig.recordHistory) recordHistory(v.id);

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
                player.loop = appConfig.loop;
                player.volume = appConfig.defaultVolume / 100;
                if (appConfig.rememberMute) {
                    player.muted = getStoredData('muted_state', false);
                }
                videoSpinner.classList.remove("hidden");
                updateSeekBarUI(0);

                const savedTime = userResumeTimes[v.id] || 0;
                if (linkSeek && linkSeek.id === v.id && linkSeek.t > 0) {
                    const target = linkSeek.t;
                    const applySeek = () => {
                        if (!linkSeek || linkSeek.id !== v.id) return;
                        const d = player.duration;
                        player.currentTime = (isFinite(d) && target > d) ? Math.max(0, d - 1) : target;
                        if (!linkSeekToasted) {
                            linkSeekToasted = true;
                            showToast(`共有された位置 (${formatTime(target)}) から`, 'resume');
                        }
                        if (!linkSeekTimer) {
                            linkSeekTimer = setTimeout(() => { linkSeek = null; linkSeekTimer = null; linkSeekToasted = false; }, 1500);
                        }
                    };
                    if (player.readyState >= 1) applySeek();
                    else player.addEventListener('loadedmetadata', applySeek, { once: true });
                    startVideoPlayback();
                } else if (savedTime > 5) {
                    pendingResumeTime = savedTime;
                    document.getElementById('resumeTimeText').textContent = `再生位置: ${formatTime(savedTime)}`;
                    document.getElementById('resumeModal').classList.remove('hidden');
                    lockBodyScroll();
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
            resetImgZoom();
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
        
        let imgZoom = { scale: 1, x: 0, y: 0 };

        function currentZoomImg() {
            const track = document.getElementById('imageTrack');
            return track ? track.children[currentImageIndex] : null;
        }

        function applyImgZoom() {
            const img = currentZoomImg();
            if (!img) return;
            img.style.transformOrigin = 'center center';
            img.style.transform = imgZoom.scale === 1 ? '' : `translate(${imgZoom.x}px, ${imgZoom.y}px) scale(${imgZoom.scale})`;
        }

        function resetImgZoom() {
            const track = document.getElementById('imageTrack');
            if (track) Array.from(track.children).forEach(img => { img.style.transform = ''; });
            imgZoom = { scale: 1, x: 0, y: 0 };
        }

        function clampImgPan() {
            const viewer = document.getElementById('imageViewer');
            const mx = viewer.clientWidth * (imgZoom.scale - 1) / 2;
            const my = viewer.clientHeight * (imgZoom.scale - 1) / 2;
            imgZoom.x = Math.max(-mx, Math.min(mx, imgZoom.x));
            imgZoom.y = Math.max(-my, Math.min(my, imgZoom.y));
        }

        function toggleImgZoomAt(clientX, clientY) {
            if (imgZoom.scale > 1) {
                resetImgZoom();
                return;
            }
            const viewer = document.getElementById('imageViewer');
            const rect = viewer.getBoundingClientRect();
            const target = 2.5;
            imgZoom.scale = target;
            imgZoom.x = (clientX - (rect.left + rect.width / 2)) * (1 - target);
            imgZoom.y = (clientY - (rect.top + rect.height / 2)) * (1 - target);
            clampImgPan();
            applyImgZoom();
        }

        function setupImageSwipeEvents() {
            const viewer = document.getElementById('imageViewer');
            let mode = null;
            let startDist = 0, startScale = 1;
            let lastX = 0, lastY = 0, moved = false;
            let lastTap = 0, lastTapX = 0, lastTapY = 0, lastTouchAt = 0;
            const dist = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);

            viewer.addEventListener('touchstart', (e) => {
                lastTouchAt = Date.now();
                if (e.target.closest && e.target.closest('button')) { mode = null; return; }
                if (e.touches.length === 2) {
                    mode = 'pinch';
                    startDist = dist(e.touches);
                    startScale = imgZoom.scale;
                    return;
                }
                if (e.touches.length === 1) {
                    const t = e.touches[0];
                    touchStartX = t.clientX;
                    touchEndX = touchStartX;
                    lastX = t.clientX; lastY = t.clientY;
                    moved = false;
                    mode = imgZoom.scale > 1 ? 'pan' : 'swipe';
                }
            }, { passive: true });

            viewer.addEventListener('touchmove', (e) => {
                if (mode === 'pinch' && e.touches.length === 2) {
                    e.preventDefault();
                    imgZoom.scale = Math.max(1, Math.min(5, startScale * dist(e.touches) / startDist));
                    if (imgZoom.scale === 1) { imgZoom.x = 0; imgZoom.y = 0; }
                    clampImgPan();
                    applyImgZoom();
                    return;
                }
                if (mode === 'pan' && e.touches.length === 1) {
                    e.preventDefault();
                    const t = e.touches[0];
                    imgZoom.x += t.clientX - lastX;
                    imgZoom.y += t.clientY - lastY;
                    lastX = t.clientX; lastY = t.clientY;
                    moved = true;
                    clampImgPan();
                    applyImgZoom();
                    return;
                }
                if (mode === 'swipe' && e.touches.length === 1) {
                    touchEndX = e.touches[0].clientX;
                    if (Math.abs(e.touches[0].clientX - lastX) > 8 || Math.abs(e.touches[0].clientY - lastY) > 8) moved = true;
                }
            }, { passive: false });

            viewer.addEventListener('touchend', (e) => {
                if (mode === 'pinch') {
                    if (e.touches.length === 0) mode = null;
                    else if (e.touches.length === 1) {
                        mode = imgZoom.scale > 1 ? 'pan' : null;
                        lastX = e.touches[0].clientX; lastY = e.touches[0].clientY;
                    }
                    return;
                }
                if (e.touches.length > 0 || !mode) return;
                const t = e.changedTouches[0];
                if (mode === 'swipe') {
                    touchEndX = t.clientX;
                    if (Math.abs(touchStartX - touchEndX) > 40) {
                        handleSwipe();
                        mode = null;
                        return;
                    }
                }
                if (!moved) {
                    const now = Date.now();
                    if (now - lastTap < 300 && Math.hypot(t.clientX - lastTapX, t.clientY - lastTapY) < 30) {
                        if (e.cancelable) e.preventDefault();
                        toggleImgZoomAt(t.clientX, t.clientY);
                        lastTap = 0;
                    } else {
                        lastTap = now; lastTapX = t.clientX; lastTapY = t.clientY;
                    }
                }
                mode = null;
            });

            viewer.addEventListener('dblclick', (e) => {
                if (Date.now() - lastTouchAt < 800) return;
                if (e.target.closest && e.target.closest('button')) return;
                toggleImgZoomAt(e.clientX, e.clientY);
            });

            viewer.addEventListener('wheel', (e) => {
                if (!e.ctrlKey && imgZoom.scale === 1) return;
                e.preventDefault();
                imgZoom.scale = Math.max(1, Math.min(5, imgZoom.scale - e.deltaY * 0.01));
                if (imgZoom.scale === 1) { imgZoom.x = 0; imgZoom.y = 0; }
                clampImgPan();
                applyImgZoom();
            }, { passive: false });
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
            unlockBodyScroll();
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

        function toggleTheaterMode(silent) {
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
                if (!silent) showToast("大画面モード: ON", 'theaterMode');
            } else {
                grid.classList.remove("max-w-7xl");
                grid.classList.add("max-w-6xl");
                playerCol.classList.remove("lg:col-span-3");
                playerCol.classList.add("lg:col-span-2");
                
                theaterBtn.innerHTML = `<i data-lucide="rectangle-horizontal" class="w-5 h-5"></i>`;
                if (!silent) showToast("大画面モード: OFF", 'theaterMode');
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
            let finalShareUrl = SHARE_CONFIG.url || (window.location.origin + window.location.pathname);
            const cur = videos.find(item => item.id === activeId);
            if (cur) {
                try {
                    const u = new URL(finalShareUrl, window.location.href);
                    u.searchParams.set('v', cur.id);
                    const isImg = cur.type === 'image' || cur.images;
                    const t = (!isImg && player) ? Math.floor(player.currentTime || 0) : 0;
                    if (t >= 3) u.searchParams.set('t', t); else u.searchParams.delete('t');
                    finalShareUrl = u.toString();
                } catch (e) {}
            }
            if (navigator.share) {
                try {
                    // iPhoneの共有メニューは「テキスト + URL」をつなげてコピーするため、テキスト内のURLは除いてURLが2個続かないようにする
                    const shareText = String(SHARE_CONFIG.text || '').replace(/https?:\/\/\S+/g, '').trim();
                    const payload = { url: finalShareUrl };
                    if (SHARE_CONFIG.title) payload.title = SHARE_CONFIG.title;
                    if (shareText) payload.text = shareText;
                    await navigator.share(payload);
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
                    showToast("画像を保存しました", 'download');
                } catch(e) {
                    window.open(imgUrl, '_blank');
                }
            } else {
                const btn = document.getElementById("downloadBtn");
                const txt = document.getElementById("downloadBtnText");
                btn.disabled = true; txt.textContent = "準備中...";
                try {
                    const res = await fetch(v.url);
                    if (!res.ok) throw new Error('HTTP ' + res.status);
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
                    const a = document.createElement("a"); a.href = blobUrl; a.download = buildDownloadName(v, 'mp4');
                    document.body.appendChild(a); a.click(); document.body.removeChild(a);
                    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
                    showToast("ダウンロード開始", 'download');
                } catch (e) {
                    let reason;
                    if (e && /^HTTP/.test(e.message || '')) reason = '配信元がエラーを返しました (' + e.message + ')';
                    else if (e && e.name === 'TypeError') reason = 'ブラウザが動画の取得をブロックしました(配信元がCORSを許可していない、または通信エラー)';
                    else reason = (e && e.message) ? e.message : '不明なエラー';
                    openDownloadModal(v.url, reason);
                } finally {
                    btn.disabled = false; txt.textContent = "ダウンロード";
                }
            }
        }

        function buildDownloadName(v, ext) {
            let name = '';
            try {
                name = decodeURIComponent(String(v.url).split('?')[0].split('#')[0].split('/').pop() || '');
            } catch (e) {}
            if (!name || !/\.[A-Za-z0-9]{2,5}$/.test(name)) {
                const base = String(v.title || ('video_' + v.id)).replace(/[\\/:*?"<>|]/g, '_').trim().slice(0, 80) || ('video_' + v.id);
                name = base + '.' + ext;
            }
            return name;
        }

        function openDownloadModal(url, reason) {
            const reasonEl = document.getElementById("downloadReason");
            if (reasonEl) {
                if (reason) { reasonEl.textContent = '自動ダウンロードに失敗した理由: ' + reason; reasonEl.classList.remove('hidden'); }
                else { reasonEl.textContent = ''; reasonEl.classList.add('hidden'); }
            }
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
                        ${userFavorites.includes(v.id) ? '<i data-lucide="heart" class="absolute top-1 left-1 w-3.5 h-3.5 text-rose-400 fill-rose-400 z-10"></i>' : ''}
                        ${userSaved.includes(v.id) ? '<i data-lucide="bookmark" class="absolute top-1 right-1 w-3.5 h-3.5 text-amber-400 fill-amber-400 z-10"></i>' : ''}
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
                if (appConfig.rememberMute) setStoredData('muted_state', player.muted);
                muteBtn.innerHTML = player.muted 
                    ? `<i data-lucide="volume-x" class="w-5 h-5 text-red-400"></i>` 
                    : `<i data-lucide="volume-2" class="w-5 h-5"></i>`;
                lucide.createIcons();
            };

            player.addEventListener("ended", () => {
                if (appConfig.autoNext) {
                    const nextId = getNextVideoId();
                    if (nextId) {
                        showToast("次の動画を再生します", "autoNext");
                        loadMedia(nextId);
                    }
                }
            });

            fullscreenBtn.onclick = () => {
                const container = document.getElementById("videoContainer");
                const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement;

                if (isFullscreen) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen().catch(err => console.error("全画面終了に失敗:", err));
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    }
                } else if (container.requestFullscreen) {
                    container.requestFullscreen().catch(err => console.error("全画面開始に失敗:", err));
                } else if (container.webkitRequestFullscreen) {
                    container.webkitRequestFullscreen();
                } else if (player && player.webkitEnterFullscreen) {
                    // iPhone Safariはコンテナ全体の全画面に対応していないため、
                    // 動画要素自体をネイティブ全画面にする
                    player.webkitEnterFullscreen();
                } else {
                    console.warn("このブラウザは全画面表示に対応していません");
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
                        skipTime(-appConfig.doubleTapSeek);
                        showRipple(leftRipple);
                    }
                    lastTapLeft = now;
                });
            }

            if (rightZone) {
                rightZone.addEventListener("click", () => {
                    const now = Date.now();
                    if (now - lastTapRight < 300) {
                        skipTime(appConfig.doubleTapSeek);
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
                        skipTime(-appConfig.arrowKeySeek);
                    }
                } else if (e.code === 'ArrowRight') {
                    e.preventDefault();
                    const v = videos.find(item => item.id === activeId);
                    if (v && (v.type === 'image' || v.images)) {
                        nextImage();
                    } else {
                        skipTime(appConfig.arrowKeySeek);
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
            if (!player.paused && appConfig.controlsHideDelay > 0) {
                controlsTimeout = setTimeout(() => {
                    controls.style.opacity = "0";
                    controls.style.pointerEvents = "none";
                }, appConfig.controlsHideDelay * 1000);
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

// すべての変数・関数の定義が終わってから初期化する(config.jsが後から読み込むため、load済みの場合は即実行)
if (document.readyState === 'complete') {
    initApp();
} else {
    window.addEventListener('load', initApp);
}
