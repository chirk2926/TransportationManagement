/* app.js */
/*
  本スクリプトは、PDFマニュアルの管理、UIレンダリング、および全体制御をオブジェクト指向で実装しています。
*/

// PDFマニュアルデータを表すクラス
class Manual {
  constructor(id, title, pdfUrl) {
    this.id = id;
    this.title = title;
    this.pdfUrl = pdfUrl;
    this.confirmed = false;
  }
  
  confirm() {
    this.confirmed = true;
  }
}

// UI表示と操作を担当するクラス
class ManualView {
  constructor(manual, listItemElement, contentElement) {
    this.manual = manual;
    this.listItemElement = listItemElement;
    this.contentElement = contentElement;
  }
  
  renderListItem() {
    this.listItemElement.textContent = this.manual.title;
    this.listItemElement.dataset.id = this.manual.id;
    this.listItemElement.addEventListener('click', () => {
      this.handleSelect();
    });
    return this.listItemElement;
  }
  
  renderContent() {
    // PDFをiframeで表示
    this.contentElement.innerHTML = `
      <h2>${this.manual.title}</h2>
      <div class="pdf-container">
        <iframe src="${this.manual.pdfUrl}" style="width:100%; height:100%;" frameborder="0">
          このブラウザはPDFの表示に対応していません。PDFを<a href="${this.manual.pdfUrl}" target="_blank">こちら</a>からダウンロードしてください。
        </iframe>
      </div>
    `;
  }
  
  handleSelect() {
    // サイドバーの他項目から active 状態を解除し、自身に付与
    document.querySelectorAll('.sidebar li').forEach(item => {
      item.classList.remove('active');
    });
    this.listItemElement.classList.add('active');
    
    // メインエリアにPDF内容を表示
    this.renderContent();
    // 現在選択中のマニュアルをControllerに通知
    Controller.setCurrentManual(this.manual);
  }
}

// 全体の制御を行うクラス
class Controller {
  static init(manuals) {
    Controller.manuals = manuals;
    Controller.listContainer = document.getElementById('manual-list');
    Controller.contentContainer = document.getElementById('manual-content');
    Controller.shareButton = document.getElementById('share-button');
    Controller.currentManual = null;
    
    Controller.renderManualList();
    Controller.setupShareButton();
    Controller.setupSharePanel();
    Controller.setupBackButton();
    Controller.setupHowtoPanel();
  }
  
  static renderManualList() {
    Controller.manuals.forEach(manual => {
      const li = document.createElement('li');
      const manualView = new ManualView(manual, li, Controller.contentContainer);
      Controller.listContainer.appendChild(manualView.renderListItem());
    });
  }
  
  static setCurrentManual(manual) {
    Controller.currentManual = manual;
  }
  
  // 戻るボタン（左上）の設定：クリックでbing.comへ遷移
  static setupBackButton() {
    const backButton = document.getElementById('back-button');
    backButton.addEventListener('click', () => {
      window.location.href = 'https://bing.com';
    });
  }
  
  // 共有ボタン（右下）の設定：選択中のPDFがあれば共有パネルを表示
  static setupShareButton() {
    Controller.shareButton.addEventListener('click', () => {
      if (Controller.currentManual) {
        document.getElementById('share-panel').classList.remove('hidden');
      } else {
        alert('PDFマニュアルを選択してください。');
      }
    });
  }
  
  // 共有パネル内の各ボタンの設定
  static setupSharePanel() {
    // PDFダウンロード
    document.getElementById('download-pdf').addEventListener('click', () => {
      if (Controller.currentManual) {
        const link = document.createElement('a');
        link.href = Controller.currentManual.pdfUrl;
        link.download = Controller.currentManual.title + '.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
    
    // 現在のページリンクコピー
    document.getElementById('copy-link').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('ページのリンクをコピーしました。');
      } catch (err) {
        alert('リンクのコピーに失敗しました。');
      }
    });
    
    // メールで送信（mailto: を使用）
    document.getElementById('send-email').addEventListener('click', () => {
      if (Controller.currentManual) {
        const subject = encodeURIComponent('PDFマニュアル共有: ' + Controller.currentManual.title);
        const body = encodeURIComponent('こちらのPDFマニュアルをご覧ください： ' + window.location.href);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
      }
    });
    
    // 共有パネルを閉じる
    document.getElementById('close-share-panel').addEventListener('click', () => {
      document.getElementById('share-panel').classList.add('hidden');
    });
  }
  
  // 使い方パネルの設定
  static setupHowtoPanel() {
    const howtoButton = document.getElementById('howto-button');
    const howtoPanel = document.getElementById('howto-panel');
    const closeHowtoButton = document.getElementById('close-howto-panel');
    
    howtoButton.addEventListener('click', () => {
      howtoPanel.classList.remove('hidden');
    });
    
    closeHowtoButton.addEventListener('click', () => {
      howtoPanel.classList.add('hidden');
    });
  }
}

// サンプルデータ（各PDFはプロジェクト内のpdfフォルダに配置）
const manualsData = [
  new Manual(1, "マニュアル 1", "pdf/manual1.pdf"),
  new Manual(2, "マニュアル 2", "pdf/manual2.pdf"),
  new Manual(3, "マニュアル 3", "pdf/manual3.pdf"),
  new Manual(4, "マニュアル 4", "pdf/manual4.pdf"),
  new Manual(5, "マニュアル 5", "pdf/manual5.pdf")
];

document.addEventListener('DOMContentLoaded', () => {
  Controller.init(manualsData);
});
