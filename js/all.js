// ----------
// Recommend Swiper
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

// 常見問答
const faqs = document.querySelectorAll(".faq-content > li");
faqs.forEach((faq) => {
	faq.addEventListener("click", function () {
		faq.classList.toggle("active");
	});
});

// BackToTop 按鈕
// 偵測往下滾動才顯示
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

// 分類標籤切換
const categories = document.querySelectorAll(".category li");
categories.forEach((item) => {
	item.addEventListener("click", () => {
		categories.forEach((category) => {
			category.classList.remove("active");
		});

		if (item.textContent === "全部") {
			data.type = "";
			item.classList.add("active");
		} else {
			data.type = item.textContent;
			item.classList.add("active");
		}

		getData(data);
	});
});

// --- 時間排序
const sortByTimeBtns = document.querySelectorAll(".sortByTimeBtn");
const sortByTimeGroup = document.querySelectorAll(".sortByTime");
const descGroup = document.querySelectorAll(".desc");
const ascGroup = document.querySelectorAll(".asc");

sortByTimeBtns.forEach((sortByTimeBtn) => {
	sortByTimeBtn.addEventListener("click", function (event) {
		event.preventDefault();

		sortByTimeGroup.forEach((sortByTime) => {
			sortByTime.classList.toggle("active");
		});

		// 由新到舊
		descGroup.forEach((desc) => {
			desc.addEventListener("click", (e) => {
				e.preventDefault();
				data.sort = 0;
				getData(data);
				sortByTimeBtn.innerHTML = `由新到舊<span class="material-symbols-outlined">keyboard_arrow_down</span>`;
			});
		});

		// 由舊到新
		ascGroup.forEach((asc) => {
			asc.addEventListener("click", (e) => {
				e.preventDefault();
				data.sort = 1;
				getData(data);
				sortByTimeBtn.innerHTML = `由舊到新<span class="material-symbols-outlined">keyboard_arrow_down</span>`;
			});
		});
	});
});

// 搜尋功能
const searchGroup = document.querySelectorAll(".search-input input");

searchGroup.forEach((search) => {
	search.addEventListener("keydown", (e) => {
		if (e.keyCode === 13) {
			// keyCode 13 是 enter 鍵
			data.search = search.value;
			data.page = 1;
			getData(data);
		}
	});
});
