// 手機版: recommend slider
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

// 搜尋工具區按鈕
// --- 篩選按鈕
const dropDownBtns = document.querySelectorAll(".dropdown");
const filterGroups = document.querySelectorAll(".filter-group");

dropDownBtns.forEach((button, index) => {
	button.addEventListener("click", function (event) {
		event.preventDefault();
		console.log(button);
		filterGroups[index].classList.toggle("active");
	});
});

// --- 時間排序
const sortByTimeBtn = document.querySelector(".sortByTimeBtn");
const sortByTime = document.querySelector(".sortByTime");

sortByTimeBtn.addEventListener("click", function (event) {
	event.preventDefault();
	sortByTime.classList.toggle("active");
});

// BackToTop 按鈕
$(".backToTopBtn").click(function () {
	$("html").animate({ scrollTop: 0 }, 1000);
});

// --------------
// 串接遠端資料
const apiPath = "https://2023-engineer-camp.zeabur.app";
let worksData = [];
let pagesData = [];

const data = {
	type: "",
	sort: 0,
	page: 1,
	search: "",
};
const cardGroup = document.querySelector(".card-group");
const pagination = document.querySelector(".pagination > ul");

function getData({ type, sort, page, search }) {
	const apiUrl = `${apiPath}/api/v1/works?sort=${sort}&page=${page}&${
		type ? `type=${type}&` : ""
	}${search ? `search=${search}` : ""}`;
	axios.get(apiUrl).then((res) => {
		worksData = res.data.ai_works.data;
		pagesData = res.data.ai_works.page;

		renderWorks();
		renderPages();
	});
}

getData(data);

// 渲染 AI 工具
function renderWorks() {
	let works = "";

	worksData.forEach((item) => {
		console.log(item);

		works += `<li class="card card-border">
		<div class="card-img">
			<img
				src="${item.imageUrl}"
				alt="${item.title}" />
		</div>
		<div class="description card-border-bottom card-pd">
			<h3 class="card-title mb-12">
				<a href="${item.link}" target="_blank">${item.title}</a>
			</h3>
			<p>${item.description}</p>
		</div>
		<div class="tools-ai card-border-bottom flex jcsb card-pd">
			<h4 class="card-font-body fw-700">AI 模型</h4>
			<span class="card-font-body">${item.model}</span>
		</div>
		<div class="tools-tag flex jcsb card-pd">
			<h4 class="card-font-body">${item.type}</h4>
			<a href="###"
				><span class="material-symbols-outlined"> share </span></a
			>
		</div>
	</li>`;
	});
	cardGroup.innerHTML = works;
}

// 切換分頁
function changePage() {
	const pageLinks = document.querySelectorAll("a.page-link");
	let pageId = "";

	pageLinks.forEach((item) => {
		item.addEventListener("click", (e) => {
			e.preventDefault();
			pageId = e.target.dataset.page;
			data.page = Number(pageId);
			getData(data);
		});
	});
}

function prePage(pagesData) {
	const prePage = document.querySelector(".prePage");

	prePage.addEventListener("click", (e) => {
		e.preventDefault();
		data.page = Number(pagesData.current_page) - 1;
		getData(data);
	});
}

function nextPage(pagesData) {
	const nextPage = document.querySelector(".nextPage");

	nextPage.addEventListener("click", (e) => {
		e.preventDefault();
		data.page = Number(pagesData.current_page) + 1;
		getData(data);
	});
}

// 分頁選染至畫面
function renderPages() {
	let pageStr = "";

	if (pagesData.has_pre) {
		pageStr += `<li>
		<a href="#" class="prePage"><span class="material-symbols-outlined">
				keyboard_arrow_left
			</span></a>
	</li>`;
	}

	for (let i = 1; i <= pagesData.total_pages; i += 1) {
		pageStr += `<li>
		<a href="#" class="page-link ${pagesData.current_page == i ? "active" : ""} ${
			pagesData.current_page == i ? "disabled" : ""
		}" data-page="${i}">${i}</a>
	</li>`;
	}

	if (pagesData.has_next) {
		pageStr += `<li>
		<a href="#" class="nextPage"><span class="material-symbols-outlined">
				keyboard_arrow_right
			</span></a>
	</li>`;
	}

	pagination.innerHTML = pageStr;

	changePage();
	prePage(pagesData);
	nextPage(pagesData);
}
