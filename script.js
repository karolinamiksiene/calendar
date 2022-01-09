let nav = 0;
let currentEventId = null;
let events = sessionStorage.getItem('events') ? JSON.parse(sessionStorage.getItem('events')) : [];

const calendar = document.getElementById('calendar');
const eventDetailsModal = document.getElementById('eventDetailsModal');
const newEventModal = document.getElementById('newEventModal');
const msgEventCreated = document.getElementById('msgEventCreated')
const eventTitleInput = document.getElementById('eventTitleInput');
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const createButton = document.getElementById('createButton');
const newEventForm = document.getElementById('newEventForm');

function showEventDetailsModal(eventId) {
    currentEventId = eventId;
    eventDetailsModal.style.display = 'block';
    newEventModal.style.display = 'none';
    msgEventCreated.style.display = 'none';

    let eventsFromStorage = JSON.parse(sessionStorage.getItem('events'));
    let result = eventsFromStorage.filter(({ id }) => id === eventId);
    let eventHtml = document.getElementById('eventText');

    eventHtml.innerHTML = "";

    result.forEach((eventForDay) => {
        if (eventForDay) {
            eventHtml.innerHTML += "<b>" + eventForDay.title + "</b><br>";
            eventHtml.innerHTML += eventForDay.startTime + " - " + eventForDay.endTime + "<br>";
            eventHtml.innerHTML += eventForDay.eventType + "<br>";
            eventHtml.innerHTML += eventForDay.description + "<br><br>";
        }
    });
}

function hideEventDetailsModal() {
    eventDetailsModal.style.display = 'none';
    createButton.style.display = 'block';
}

function showCreateEventModal() {
    newEventModal.style.display = 'block';
    eventDetailsModal.style.display = 'none';
    msgEventCreated.style.display = 'none';
    createButton.style.display = 'none';
    newEventForm.reset();
}

function hideCreateEventModal() {
    newEventModal.style.display = 'none';
    createButton.style.display = 'block';
}

function loadCalendar() {
    const dt = new Date();

    if (nav !== 0 ) {
        dt.setMonth(dt.getMonth() + nav);
    }

    const day = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();

    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    });
    
    const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);
    document.getElementById('monthDisplay').innerText = `${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`;

    calendar.innerHTML = '';

    for(let i = 1; i <= paddingDays + daysInMonth; i++) {
        const daySquare = document.createElement('div');
        daySquare.classList.add('day');

        const dayString = year + "-" + (month + 1).toString().padStart(2, 0) + "-" + (i - paddingDays).toString().padStart(2, 0);
        if (i > paddingDays) {
            daySquare.innerText = i - paddingDays;
            const eventsForDay = events.filter(e => e.date === dayString);
            eventsForDay.forEach((eventForDay) => {
                if (eventForDay) {
                    const eventDiv = document.createElement('div');
                    eventDiv.classList.add('event');
                    eventDiv.classList.add(eventForDay.eventType);
                    eventDiv.innerText = eventForDay.title + "\n" + eventForDay.startTime + " - " + eventForDay.endTime;
                    eventDiv.addEventListener('click', () => showEventDetailsModal(eventForDay.id));
                    daySquare.appendChild(eventDiv);
                }
            });
        } else {
            daySquare.classList.add('padding');
        }
        calendar.appendChild(daySquare);
    }
}

function saveEvent() {
    if (!eventTitleInput.value) {
        alert('Event Title was not entered');
        return;
    }

    if (!eventDate.value) {
        alert('Event Date was not entered');
        return;
    }

    if (!eventStartTime.value) {
        alert('Event start time was not entered');
        return;
    }

    if (!eventEndTime.value) {
        alert('Event end time was not entered');
        return;
    }

    if (!eventType.value) {
        alert('Event Type not chosen');
        return;
    }

    events.push({
            id: makeId(10),
            date: eventDate.value,
            title: eventTitleInput.value,
            startTime: eventStartTime.value,
            endTime: eventEndTime.value,
            eventType: eventType.value,
            description: eventDescription.value,
    });

    sessionStorage.setItem('events', JSON.stringify(events));
    msgEventCreated.style.display = 'block';
    hideCreateEventModal();
    loadCalendar();
}

function deleteEvent (){
    let result = confirm("Are you sure you want to delete event?");
    if (result) {
        events = events.filter(e => e.id !== currentEventId);
        sessionStorage.setItem('events', JSON.stringify(events));
        hideEventDetailsModal();
        loadCalendar();
    }
}

function initButtons() {
    document.getElementById('nextButton').addEventListener('click', () => {
        nav++;
        loadCalendar();
    });
    
    document.getElementById('backButton').addEventListener('click', () => {
        nav--;
        loadCalendar();
    });

    document.getElementById('saveButton').addEventListener('click', saveEvent);
    document.getElementById('cancelButton').addEventListener('click', hideCreateEventModal);

    document.getElementById('deleteButton').addEventListener('click', deleteEvent);
    document.getElementById('closeButton').addEventListener('click', hideEventDetailsModal);
}

function makeId(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

initButtons();
loadCalendar();