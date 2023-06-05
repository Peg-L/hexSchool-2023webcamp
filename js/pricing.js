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

// 常見問答
const faqs = document.querySelectorAll(".faq-content > li");
faqs.forEach((faq, index) => {
	faq.addEventListener("click", function (event) {
		faq.classList.toggle("active");
	});
});

// BackToTop 按鈕
$(".backToTopBtn").click(function () {
	$("html").animate({ scrollTop: 0 }, 1000);
});
