document.addEventListener('DOMContentLoaded', async function () {    
    loadData(); 
});

async function loadData(){
    
    let allEmailServices;
    await fetch('/api/email_service')
        .then(response => response.json())
        .then(data => {
            // console.log("Mutual Funds:", data);
                allEmailServices = data;
        })
    .catch(error => console.error("Error fetching data:", error));
    console.log(allEmailServices)

    let totalcon = document.getElementsByClassName('stat-number')[0]
    let activecon = document.getElementsByClassName('stat-number')[1]
    let pausedcon = document.getElementsByClassName('stat-number')[2]
    
    let activeser = 0,pausedser = 0

    for(let i = 0;i<allEmailServices.length;i++){
        for(let key in allEmailServices[i]){
            if(allEmailServices[i][key].status == 0) pausedser++;
            else activeser++;
        }
    }
    totalcon.innerHTML = activeser+pausedser
    activecon.innerHTML = activeser
    pausedcon.innerHTML = pausedser
    const sidebar = document.querySelector('.sidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        const menuBtn = document.querySelector('.menu-btn');
        
        function toggleMobileSidebar() {
            sidebar.classList.toggle('mobile-open');
            sidebarOverlay.classList.toggle('show');
            document.body.style.overflow = sidebar.classList.contains('mobile-open') ? 'hidden' : '';
        }

        function closeMobileSidebar() {
            sidebar.classList.remove('mobile-open');
            sidebarOverlay.classList.remove('show');
            document.body.style.overflow = '';
        }

    
        menuBtn.addEventListener('click', toggleMobileSidebar);

        sidebarOverlay.addEventListener('click', closeMobileSidebar);


        document.querySelectorAll('.sidebar-item').forEach(item => {
            item.addEventListener('click', function() {
                
                document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
                this.classList.add('active');
              
                if (window.innerWidth <= 768) {
                    closeMobileSidebar();
                }
            });
        });

        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                closeMobileSidebar();
            }
        });

      
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && sidebar.classList.contains('mobile-open')) {
                closeMobileSidebar();
            }
        });

        document.querySelector('.create-btn').addEventListener('click', function() {
            console.log('Navigate to create cronjob page');
        });

        document.querySelector('.learn-more-btn').addEventListener('click', function() {
            console.log('Navigate to membership page');
        });

        document.querySelectorAll('.actions-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                console.log('Show event details');
            });
        });

        document.querySelectorAll('.header-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                if (this.textContent.includes('LOGOUT')) {
                    console.log('Logout user');
                } else if (this.textContent.includes('ENGLISH')) {
                    console.log('Show language options');
                }
            });
        });

        document.querySelector('.back-btn').addEventListener('click', function() {
            console.log('Navigate back');
        });

        let touchStartX = 0;
        let touchEndX = 0;

        document.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });

        document.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 100;
            const swipeDistance = touchEndX - touchStartX;
          
            if (swipeDistance > swipeThreshold && touchStartX < 50 && window.innerWidth <= 768) {
                if (!sidebar.classList.contains('mobile-open')) {
                    toggleMobileSidebar();
                }
            }
          
            if (swipeDistance < -swipeThreshold && sidebar.classList.contains('mobile-open')) {
                closeMobileSidebar();
            }
        }

        document.documentElement.style.scrollBehavior = 'smooth';

        function preventBodyScroll(prevent) {
            if (prevent) {
                document.body.style.position = 'fixed';
                document.body.style.top = `-${window.scrollY}px`;
                document.body.style.width = '100%';
            } else {
                const scrollY = document.body.style.top;
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }

        const originalToggle = toggleMobileSidebar;
        toggleMobileSidebar = function() {
            const wasOpen = sidebar.classList.contains('mobile-open');
            originalToggle();
            
            if (window.innerWidth <= 768) {
                preventBodyScroll(!wasOpen);
            }
        };

        const originalClose = closeMobileSidebar;
        closeMobileSidebar = function() {
            originalClose();
            if (window.innerWidth <= 768) {
                preventBodyScroll(false);
            }
        };

}