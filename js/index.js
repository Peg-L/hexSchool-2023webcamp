// 手機版: recommend slider

// 搜尋工具區按鈕
// --- 篩選按鈕
const dropDownBtns = document.querySelectorAll(".dropdown");
const filterGroups = document.querySelectorAll(".filter-group");

dropDownBtns.forEach((button, index) => {
	button.addEventListener("click", function (event) {
		event.preventDefault();
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
// 偵測滾動才顯示
const backToTopBtn = document.querySelector(".backToTopBtn");

window.onscroll = function () {
	scrollFunction();
};

function scrollFunction() {
	if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
		backToTopBtn.style.display = "block";
	} else {
		backToTopBtn.style.display = "none";
	}
}

// 點擊後跳轉到最上面
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
		renderPages(pagesData);
	});
}

getData(data);

// 渲染 AI 工具
function renderWorks() {
	let works = "";

	worksData.forEach((item) => {
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
const searches = document.querySelectorAll(".search");

function changePage() {
	const pageLinks = document.querySelectorAll("a.page-link");
	let pageId = "";

	pageLinks.forEach((item) => {
		item.addEventListener("click", (e) => {
			e.preventDefault();
			pageId = e.target.dataset.page;
			data.page = Number(pageId);
			getData(data);

			// 滑到搜尋區最上方
			searches.forEach((search) => {
				console.log(search);

				search.scrollIntoView({ behavior: "smooth" });
			});
		});
	});
}

// 上一頁
function prePage(pagesData) {
	const prePage = document.querySelector(".prePage");

	prePage.addEventListener("click", (e) => {
		e.preventDefault();
		data.page = Number(pagesData.current_page) - 1;
		getData(data);

		// 滑到搜尋區最上方
		searches.forEach((search) => {
			console.log(search);

			search.scrollIntoView({ behavior: "smooth" });
		});
	});
}

// 下一頁
function nextPage(pagesData) {
	const nextPage = document.querySelector(".nextPage");

	nextPage.addEventListener("click", (e) => {
		e.preventDefault();
		data.page = Number(pagesData.current_page) + 1;
		getData(data);

		// 滑到搜尋區最上方
		searches.forEach((search) => {
			console.log(search);

			search.scrollIntoView({ behavior: "smooth" });
		});
	});
}

// 分頁選染至畫面
function renderPages(pagesData) {
	let pageStr = "";
	console.log(pagesData.has_pre);
	console.log(pagesData.has_next);

	pageStr += `
	<li>
		<a href="#" class="prePage ${pagesData.has_pre ? "" : "disabled"}">
			<span class="material-symbols-outlined">
				keyboard_arrow_left
			</span>
		</a>
	</li>`;

	for (let i = 1; i <= pagesData.total_pages; i += 1) {
		pageStr += `<li>
		<a href="#" class="page-link ${pagesData.current_page == i ? "active" : ""} ${
			pagesData.current_page == i ? "disabled" : ""
		}" data-page="${i}">${i}</a>
	</li>`;
	}

	pageStr += `
	<li>
		<a href="#" class="nextPage ${pagesData.has_next ? "" : "disabled"}">
			<span class="material-symbols-outlined">
				keyboard_arrow_right
			</span>
		</a>
	</li>`;

	console.log(pageStr);

	pagination.innerHTML = pageStr;

	changePage();
	prePage(pagesData);
	nextPage(pagesData);
}

// ----------
// 輪播 Swiper 測試
// Swiper
var swiper = new Swiper(".swiper", {
	breakpoints: {
		992: {
			slidesPerView: 3,
		},
		768: {
			slidesPerView: 2,
		},
		375: {
			slidesPerView: 1,
		},
	},
	spaceBetween: 24,
	pagination: {
		el: ".swiper-pagination",
		clickable: true,
	},
	autoplay: {
		delay: 5000,
	},
});
