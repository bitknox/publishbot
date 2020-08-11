 class RateLimit {

    constructer(rateLimit, rateTime) {
        this.rateLimit = rateLimit;
        this.rateTime = rateTime * 1000;
        this.firstMessageTime = 0;
        this.messagesSent = 0;
    }

    isRateLimited() {
        if (messagesSent >= rateLimit) {
            if (!canResetRateLimit) return true
        }
        return false
    }

    getTimeUntilNotRateLimited() {
        return Date.now() - (firstMessageTime + rateTime)
    }

    canResetRateLimit() {
        return getTimeUntilNotRateLimited < 0
    }

    addMessageCount() {
        if (canResetRateLimit) {
            firstMessageTime = Date.now()
            messagesSent = 1
        } else {
            messagesSent++
        }

    }

}


module.exports = RateLimit