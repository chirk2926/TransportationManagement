// このスクリプトは TypeScript 記法で記述しています。
// ビルド環境に合わせてコンパイルしてください。

(() => {
  // ヘルパー：要素の表示/非表示を切替
  const toggleVisibility = (elem: HTMLElement) => {
    elem.classList.toggle("hidden");
  };

  // ===============================
  // 現在位置の操作（UP/DOWN）
  // ===============================
  const routeSteps = Array.from(document.querySelectorAll(".route-step")) as HTMLElement[];
  let currentIndex = routeSteps.findIndex((step) => step.classList.contains("current"));
  if (currentIndex === -1) currentIndex = 0;
  
  const updateCurrentStep = (newIndex: number) => {
    if (newIndex < 0 || newIndex >= routeSteps.length) return;
    routeSteps[currentIndex].classList.remove("current");
    currentIndex = newIndex;
    routeSteps[currentIndex].classList.add("current");
  };

  // メイン UP / DOWN ボタン
  document.getElementById("up-button")?.addEventListener("click", () => {
    updateCurrentStep(currentIndex - 1);
  });
  document.getElementById("down-button")?.addEventListener("click", () => {
    updateCurrentStep(currentIndex + 1);
  });

  // OPERATION パネル内の UP / DOWN ボタン
  document.getElementById("op-up-button")?.addEventListener("click", () => {
    updateCurrentStep(currentIndex - 1);
  });
  document.getElementById("op-down-button")?.addEventListener("click", () => {
    updateCurrentStep(currentIndex + 1);
  });


  // ===============================
  // 輸送経路変更 UI
  // ===============================
  const changeRouteButton = document.getElementById("change-route-button");
  const routeChangeUI = document.getElementById("route-change-ui");
  changeRouteButton?.addEventListener("click", () => {
    toggleVisibility(routeChangeUI as HTMLElement);
  });

  const routeChangeForm = document.getElementById("route-change-form") as HTMLFormElement;
  routeChangeForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const newRoute = (document.getElementById("new-route") as HTMLInputElement).value;
    alert("新しい経路情報: " + newRoute);
    (routeChangeUI as HTMLElement).classList.add("hidden");
    // 実際には経路表示部分を更新するなどの処理を追加可能
  });


  // ===============================
  // 遅延情報 UI
  // ===============================
  const delayButton = document.getElementById("delay-button");
  const delayUI = document.getElementById("delay-ui");
  delayButton?.addEventListener("click", () => {
    toggleVisibility(delayUI as HTMLElement);
  });
  
  // 遅延情報内の各オプションボタン
  const delayOptions = document.querySelectorAll(".delay-option");
  delayOptions.forEach((button) => {
    button.addEventListener("click", () => {
      const option = (button as HTMLElement).dataset.option;
      alert("選択された遅延対応: " + option);
      // option に応じた処理をここで実装
    });
  });


  // ===============================
  // 商品追加 UI と画像アップロード
  // ===============================
  const addProductButton = document.getElementById("add-product-button");
  const addProductUI = document.getElementById("add-product-ui");
  addProductButton?.addEventListener("click", () => {
    toggleVisibility(addProductUI as HTMLElement);
  });

  const productForm = document.getElementById("product-form") as HTMLFormElement;
  const productList = document.getElementById("product-list");
  productForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    // 入力値取得
    const name = (document.getElementById("product-name") as HTMLInputElement).value;
    const size = (document.getElementById("product-size") as HTMLInputElement).value;
    const weight = (document.getElementById("product-weight") as HTMLInputElement).value;
    const quantity = (document.getElementById("product-quantity") as HTMLInputElement).value;
    const frozen = (document.getElementById("product-frozen") as HTMLSelectElement).value;
    const date = (document.getElementById("transport-date") as HTMLInputElement).value;
    const remarks = (document.getElementById("product-remarks") as HTMLTextAreaElement).value;
    
    // 商品情報リストに反映
    const li = document.createElement("li");
    li.textContent = `商品名: ${name}, 大きさ: ${size}, 重さ: ${weight}, 数量: ${quantity}, 冷凍: ${frozen}, 輸送日: ${date}, 備考: ${remarks}`;
    productList?.appendChild(li);
    productForm.reset();
    (addProductUI as HTMLElement).classList.add("hidden");
  });

  // 画像アップロードとプレビュー表示
  const productImageUpload = document.getElementById("product-image-upload") as HTMLInputElement;
  const imagePreview = document.getElementById("image-preview");
  productImageUpload?.addEventListener("change", (e) => {
    const target = (e.target as HTMLInputElement);
    if (target.files && target.files[0]) {
      const file = target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          imagePreview!.innerHTML = `<img src="${event.target.result}" alt="アップロード画像プレビュー" />`;
        }
      };
      reader.readAsDataURL(file);
    }
  });


  // ===============================
  // 到着時間・遅延・倉庫状況入力 UI
  // ===============================
  const arrivalButton = document.getElementById("arrival-button");
  const arrivalUI = document.getElementById("arrival-ui");
  arrivalButton?.addEventListener("click", () => {
    toggleVisibility(arrivalUI as HTMLElement);
  });
  
  const arrivalForm = document.getElementById("arrival-form") as HTMLFormElement;
  const arrivalInfoOutput = document.getElementById("arrival-info-output");
  arrivalForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const hours = (document.getElementById("arrival-hours") as HTMLInputElement).value;
    const minutes = (document.getElementById("arrival-minutes") as HTMLInputElement).value;
    const delayMins = (document.getElementById("delay-minutes") as HTMLInputElement).value;
    const warehouseStatus = (document.getElementById("warehouse-status") as HTMLSelectElement).value;
    let output = `到着予定: ${hours}時間 ${minutes}分後<br>倉庫状況: ${warehouseStatus}`;
    if (delayMins && parseInt(delayMins) > 0) {
      output += `<br style="color:red;">遅延: ${delayMins}分</span>`;
    }
    arrivalInfoOutput!.innerHTML = output;
    (arrivalUI as HTMLElement).classList.add("hidden");
  });


  // ===============================
  // 右下固定の OPERATION UI
  // ===============================
  const operationButton = document.getElementById("operation-button");
  const operationUI = document.getElementById("operation-ui");
  operationButton?.addEventListener("click", () => {
    toggleVisibility(operationUI as HTMLElement);
  });
  
  // 商品情報リセット
  document.getElementById("reset-products")?.addEventListener("click", () => {
    productList!.innerHTML = "";
  });
  // 到着・遅延情報リセット
  document.getElementById("reset-arrival")?.addEventListener("click", () => {
    arrivalInfoOutput!.innerHTML = "";
  });
})();
