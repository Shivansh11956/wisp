document.addEventListener('DOMContentLoaded', async function () {    
    loadData(); 
});

async function pauseFund(id,schedule){
        console.log(id)
        console.log(schedule)
        if(schedule == "1 hour"){
            await fetch(`/email/services1/pause/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            }); 
        }else if(schedule == "6 hours"){
            await fetch(`/email/services6/pause/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        }); 
        }else if(schedule =="12 hours"){
            await fetch(`/email/services12/pause/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        }); 
        }else if(schedule == "24 hours"){
            await fetch(`/email/services24/pause/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        }); 
        }
        location.reload()
    }
async function resumeFund(id,schedule){
        console.log(id)
        console.log(schedule)
        if(schedule == "1 hour"){
            await fetch(`/email/services1/resume/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            }); 
        }else if(schedule == "6 hours"){
            await fetch(`/email/services6/resume/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        }); 
        }else if(schedule =="12 hours"){
            await fetch(`/email/services12/resume/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        }); 
        }else if(schedule == "24 hours"){
            await fetch(`/email/services24/resume/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        }); 
        }
        location.reload()
    }
    async function removeFund(id,schedule){
        console.log(id)
        console.log(schedule)
        if(schedule == "1 hour"){
            await fetch(`/email/services1/remove/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            }); 
        }else if(schedule == "6 hours"){
            await fetch(`/email/services6/remove/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        }); 
        }else if(schedule =="12 hours"){
            await fetch(`/email/services12/remove/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        }); 
        }else if(schedule == "24 hours"){
            await fetch(`/email/services24/remove/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        }); 
        }
        location.reload()
    }
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
    let tbody = document.getElementById('tbody')
    let totalcon = document.getElementsByClassName('stat-number')[0]
    let activecon = document.getElementsByClassName('stat-number')[1]
    let pausedcon = document.getElementsByClassName('stat-number')[2]
    
    let activeser = 0,pausedser = 0

    for(let i = 0;i<allEmailServices.length;i++){
        for(let key in allEmailServices[i]){
        if(allEmailServices[i][key].status == 0) pausedser++;
        else activeser++;
        let pausebtn = `<button class="actions-btn" onclick="pauseFund('${allEmailServices[i][key]._id}','${allEmailServices[i][key].schedule}')">Pause</button>`
        if(allEmailServices[i][key].status == 0) pausebtn = `<button class="actions-btn" onclick="resumeFund('${allEmailServices[i][key]._id}','${allEmailServices[i][key].schedule}')">Resume</button>`
        let statusclass = `active-class`
        if(allEmailServices[i][key].status == 0) statusclass = 'inactive-class'
        tbody.innerHTML = `<tr>
                                <td>
                                    <div class="event-status">
                                        <div class="status-icon">✓</div>
                                        <div class="event-details">
                                            <div class="event-title">${allEmailServices[i][key].serviceName.slice(0,19)}</div>
                                            <div class="event-url">To : ${allEmailServices[i][key].to}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="event-date ${statusclass}" >● ${allEmailServices[i][key].status == 1 ? 'Active' : 'Paused'}</td>
                                <td class="event-date">${allEmailServices[i][key].lastUpdated}</td>
                                <td>
                                    ${pausebtn}
                                    <button class="actions-btn"  onclick="removeFund('${allEmailServices[i][key]._id}','${allEmailServices[i][key].schedule}')">Remove</button>
                                </td>
                            </tr>` + tbody.innerHTML
    }
       if(tbody.innerHTML == ''){
         tbody.innerHTML = ` <tr>
                                <td>No service initiated</td>
                            </tr>`
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