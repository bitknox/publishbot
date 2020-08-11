function limiter(limit, time){
    this.limit = limit;
    this.time = time*1000
    this.timestamps = []

    this.checkLimit = () => {
        if(this.timestamps.length === 0) return 0
        return this.timestamps.filter(timestamp => timestamp > Date.now() - this.time)
    }
    this.isLimited = () => {
        return (this.limit-this.checkLimit().length) <= 0
    }
    this.addEvent = () => {
        this.timestamps.push(Date.now())
    }
    this.getTimeStamps = () => { return this.timestamps}
}

module.exports = limiter