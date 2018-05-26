let game=new Game();
game.init();
game._addFailedFn(failed);
game._addSuccessFn(success);
let mask=document.getElementsByClassName("mask")[0];
let score=mask.getElementsByClassName("score")[0];
let restartBtn=mask.getElementsByClassName("restart")[0];
let current_score=document.getElementsByClassName("current-score")[0];

restartBtn.addEventListener("click",restart);
function failed() {
  score.innerText = game.score;
  mask.style.display="flex";
}
function success(score) {
  current_score.innerHTML=score;
}
function restart() {
  mask.style.display = 'none';
  game._restart();
}