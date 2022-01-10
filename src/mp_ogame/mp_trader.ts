export class MpTrader {
  interval?: NodeJS.Timer;

  myBet = 0;

  get playerName() {
    const playerNameChilds = document.querySelectorAll('#playerName span');
    return playerNameChilds[playerNameChilds.length - 1].textContent!.trim();
  }
  
  get inputMet() {
    return document.querySelectorAll<HTMLInputElement>(".normalResource input").item(0)
  }
  
  get maxButton() {
      return document.querySelectorAll<HTMLButtonElement>(".normalResource a.max").item(0)
  }
  
  get payButton() {
      return document.querySelectorAll<HTMLButtonElement>("a.pay").item(0)
  }

  get currentPlayerName() {
    const cp = document.querySelectorAll('.currentPlayer').item(0)
    return cp.textContent?.trim();
  }

  get currentBet() {
    const currentBetEl = document.querySelectorAll(".detail_value.odd.currentSum").item(0)
    return Number.parseInt(currentBetEl.textContent!.replaceAll('.', ''))
  }

  public bot(maxBet: number, timer?: number) {
  
    function getCurrentBet() {
      const currentBetEl = document.querySelectorAll(".detail_value.odd.currentSum").item(0)
      return Number.parseInt(currentBetEl.textContent!.replaceAll('.', ''))
    }

    const submit = () => {
        this.myBet = +this.inputMet.value
        this.payButton.click()
    }
  
    this.interval = setInterval(() => {
  
        if (this.currentPlayerName === this.playerName) {
            this.myBet = getCurrentBet()
            console.debug("Current Player match your name")
            return
        }
  
        if (this.currentBet >= maxBet) {
            console.debug("Current bet is over the limit")
            stop()
            return
        }
  
        this.maxButton.click()
  
        submit()
    }, timer || 1050)
  }

  public betMetal() {
    this.maxButton.click()
    this.payButton.click()
  }

  public stop() {
    this.interval && clearInterval(this.interval)
  }
}