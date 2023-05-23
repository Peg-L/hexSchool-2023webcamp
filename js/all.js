// Master DOManipulator v2 ------------------------------------------------------------
const items = document.querySelectorAll(".recommend-item");
const controls = document.querySelectorAll(".control");
const activeDelay = 0.76;
const interval = 5000;

let current = 0;

const slider = {
	init: () => {
		controls.forEach((control) =>
			control.addEventListener("click", (e) => {
				slider.clickedControl(e);
			})
		);
		controls[current].classList.add("active");
		items[current].classList.add("active");
	},
	nextSlide: () => {
		// Increment current slide and add active class
		slider.reset();
		if (current === items.length - 1) current = -1; // Check if current slide is last in array
		current++;
		controls[current].classList.add("active");
		items[current].classList.add("active");
	},
	clickedControl: (e) => {
		// Add active class to clicked control and corresponding slide
		slider.reset();
		clearInterval(intervalF);

		const control = e.target;
		const dataIndex = Number(control.dataset.index);

		control.classList.add("active");
		items.forEach((item, index) => {
			if (index === dataIndex) {
				// Add active class to corresponding slide
				item.classList.add("active");
			}
		});
		current = dataIndex; // Update current slide
		intervalF = setInterval(slider.nextSlide, interval); // Fire that bad boi back up
	},
	reset: () => {
		// Remove active classes
		items.forEach((item) => item.classList.remove("active"));
		controls.forEach((control) => control.classList.remove("active"));
	},
};

let intervalF = setInterval(slider.nextSlide, interval);
slider.init();
