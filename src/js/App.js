import axios from "/node_modules/axios/dist/esm/axios.js";

//global vars :
const BASE_URL = "http://localhost:3000/transactions";
let searchedDatas = await fetchData();

// select elements :

const transactionbtn = document.querySelector(".transaction-btn");
const transactionList = document.querySelector("#transaction-list");
const transactionContainer = document.querySelector(
  ".transaction-table-container"
);
const searchInput = document.querySelector(".transaction-header__search");
const transactionHistorySorter = document.querySelector(
  "#transaction-history-sort"
);
const transactionPriceSorter = document.querySelector(
  "#transaction-price-sort"
);

// events :
transactionbtn.addEventListener("click", async () => {
  hideToggler();
  renderDatas(await fetchData());
});

searchInput.addEventListener("focus", () => {
  hideToggler();
});

searchInput.addEventListener("input", async (e) => {
  searchedDatas = await fetchData(`refId_like=${e.target.value}`);
  renderDatas(searchedDatas);
});

transactionHistorySorter.addEventListener("click", async () => {
  await SortBy(transactionHistorySorter, "date");
});

transactionPriceSorter.addEventListener("click", async () => {
  await SortBy(transactionPriceSorter, "price");
});

//functions :

async function fetchData(query = "_sort=date&_order=desc") {
  try {
    const res = await axios.get(`${BASE_URL}?${query}`);
    return await res.data;
  } catch (error) {
    return error.message;
  }
}

function renderDatas(data) {
  let result = "";
  const dateOptions = { year: "numeric", month: "2-digit", day: "2-digit" };
  data?.forEach((item) => {
    result += `<tr>
    <td>${item.id}</td>
    <td class=${item.type == "افزایش اعتبار" ? "green" : "red"}>${
      item.type
    }</td>
    <td>${item.price}</td>
    <td>${item.refId}</td>
    <td>${new Date(item.date).toLocaleDateString("fa-IR", dateOptions)}</td>
  </tr>`;
  });
  transactionList.innerHTML = result;
}

function hideToggler() {
  transactionbtn.classList.add("hidden");
  transactionContainer.classList.remove("hidden");
}

function findSameResults(sortedData) {
  const sameResults = sortedData.filter((item) =>
    searchedDatas.some(
      (searchedItem) => JSON.stringify(item) == JSON.stringify(searchedItem)
    )
  );
  return sameResults;
}
async function SortBy(element, sort) {
  element.classList.toggle("rotate");
  if (element.classList.contains("rotate")) {
    const sortedhResult = await fetchData(`_sort=${sort}&_order=asc`);
    renderDatas(findSameResults(sortedhResult));
  } else {
    const sortedhResult = await fetchData(`_sort=${sort}&_order=desc`);
    renderDatas(findSameResults(sortedhResult));
  }
}
