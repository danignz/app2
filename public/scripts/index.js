function disablebuttons() {
  setTimeout(function () {
    const RemoveBtnCollection = document.getElementsByClassName("answer");
    [...RemoveBtnCollection].forEach((RemoveBtn) => {
      RemoveBtn.disabled = true;
    });
  }, 0);
}
