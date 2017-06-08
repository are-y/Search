function DealingClass() {

    function Dealing() {
        this.isDeal = false;
        this.page = 0;
        this.isLoad=true;
        return this
    }
    Dealing.prototype.deal = function (data) {
        this.isDeal = true;
        this.page = data;
    }
    Dealing.prototype.back=function(){
        this.isLoad=false;
    }
    
    return new Dealing();
}
module.exports = {
    Dealing: DealingClass
}