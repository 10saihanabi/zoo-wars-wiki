(() => {
  const form = document.getElementById('communityForm');
  const message = document.getElementById('submitMessage');
  const mailButton = document.getElementById('mailButton');
  const gmailButton = document.getElementById('gmailButton');
  const recipient = 'dbwdbw@gmail.com';

  if (!form || !message || !mailButton || !gmailButton) {
    return;
  }

  const getMailContent = () => {
    const data = new FormData(form);
    const author = String(data.get('author_name') || '').trim() || '匿名';
    const category = String(data.get('category') || '').trim();
    const title = String(data.get('title') || '').trim();
    const body = String(data.get('body') || '').trim();
    const rightsConfirmed = data.get('rights_confirmed') === 'on';

    if (!category || !title || !body || !rightsConfirmed) {
      return null;
    }

    const subject = `[DBW投稿][${category}] ${title}`;
    const mailBody = [
      '動物園ウォーズ攻略Wikiへの投稿です。',
      '',
      `投稿者名：${author}`,
      `種類：${category}`,
      `タイトル：${title}`,
      '',
      '本文：',
      body,
      '',
      '権利確認：',
      '自作、または掲載許可を得た文章・画像です。',
      '',
      '画像がある場合は、このメールに添付してください。',
    ].join('\n');

    return {
      subject,
      mailBody,
    };
  };

  const showValidationMessage = () => {
    message.className = 'community-submit-message warn';
    message.textContent =
      'タイトル・本文・種類・権利確認を入力してください。';
  };

  const openMailClient = () => {
    const content = getMailContent();

    if (!content) {
      showValidationMessage();
      return;
    }

    const url =
      `mailto:${recipient}` +
      `?subject=${encodeURIComponent(content.subject)}` +
      `&body=${encodeURIComponent(content.mailBody)}`;

    window.location.href = url;
  };

  const openGmail = () => {
    const content = getMailContent();

    if (!content) {
      showValidationMessage();
      return;
    }

    const url =
      'https://mail.google.com/mail/?view=cm&fs=1' +
      `&to=${encodeURIComponent(recipient)}` +
      `&su=${encodeURIComponent(content.subject)}` +
      `&body=${encodeURIComponent(content.mailBody)}`;

    window.open(url, '_blank', 'noopener');
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    openMailClient();
  });

  mailButton.addEventListener('click', openMailClient);
  gmailButton.addEventListener('click', openGmail);
})();
