// rotation following the mouse cursor
// retrieve the coordinates describing the center of the phone
const phone = document.querySelector('.phone');
const boundingBox = phone.getBoundingClientRect();
const centerX = boundingBox.left + boundingBox.width / 2;
const centerY = boundingBox.top + boundingBox.height / 2;

// when hovering on the window, rotate the phone in accordance to the position of the cursor
// position of the cursor compared to the center of the phone
window.addEventListener('mousemove', (e) => {
  const { pageX, pageY } = e;
  const [diffX, diffY] = [centerX - pageX, centerY - pageY];
  // ! maintain the default translateZ property
  phone.style.transform = `translateZ(-180px) rotateX(${diffY / 180}deg) rotateY(${-diffX /180}deg)`;
});

// target the form element
const form = phone.querySelector('.phone__form');

const input = document.querySelector('.phone__form input');

input.addEventListener('input', function() {
    this.style.height = 'auto'; // Reset the height
    this.style.height = Math.min(this.scrollHeight, 500) + 'px'; // Expand up to 500px
});



// on submit retrieve the value from the nested input element and add the text in the chat section
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const { value } = form.querySelector('input');
  if (value) {
    const chat = phone.querySelector('.phone__chat');
    const message = document.createElement('p');
    message.classList.add('chat--message');
    message.textContent = value;
    chat.appendChild(message);
  }
  form.reset();
});
