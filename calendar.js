(function () {
    history.scrollRestoration = 'manual';
    var app = new Vue({
        el:"#app",
        data:{
            selectYear:"",
            selectMonth:"",
            selectDD:"",
            firstDay:0,
            showCalendarArray:[],
            selectIndex:-1,
            selectDate:"",  //选中的日期
        },
        created:function () {
            //获取当前月当前天的数据
            var date=new Date(),
                _this=this;
            //初始化日历
            this.showCalendarArray.push(this.initCalendarData(date,true));
            var fn=function () {
                _this.showCalendarArray.push(_this.getNextMonth());
                _this.$nextTick(function () {
                    if(document.getElementById('app').offsetHeight<=window.innerHeight) {
                        fn()
                    }else {
                        window.onscroll=function () {
                            if(window.scrollY+window.innerHeight>=document.body.scrollHeight) {
                                _this.showCalendarArray.push(_this.getNextMonth());
                            }
                            if(window.scrollY==0) {
                                _this.showCalendarArray.unshift(_this.getPreMonth());
                                _this.showCalendarArray.unshift(_this.getPreMonth());
                                window.scrollTo(0,10)
                            }
                        }
                    }
                })
            }
            fn();
        },
        mounted:function(){
            var _this=this;
            var container = document.querySelectorAll('#calendar');
            for(var i = 0; i <container.length; i++){                          //为每个特定DOM元素绑定touchstart touchmove时间监听 判断滑动方向
                var x,  X;
                container[i].addEventListener('touchstart', function(event) {   //记录初始触控点横坐标
                    x = event.changedTouches[0].pageX;
                });
                container[i].addEventListener('touchend', function(event){
                    X = event.changedTouches[0].pageX;                          //记录当前触控点横坐标
                    if(X - x > 10){                                             //右滑
                        // alert("右滑");
                        _this.getPreMonth(_this.selectDate);
                    }
                    if(x - X > 10){                                             //左滑
                        // alert("左滑");
                        _this.getNextMonth(_this.selectDate);
                    }
                });
            }
        },
        methods:{
            initCalendarData:function (date,initFlag) {
                var year=date.getFullYear();//年份
                var month=date.getMonth()+1;//月份
                var dd=date.getDate();//天
                var day=date.getDay();//星期
                //判断一个月多少天？
                date.setMonth(month);
                date.setDate(0);
                var hm=date.getDate();//当前月份的天数
                //判断当前月的1号星期几？
                var fir=1+(day+7-dd%7)%7;  //4
                //判断有多少行
                var row = Math.ceil((hm+fir)/7);  //5
                //判断最后有多少个空格
                var lastSpace = 7*row - hm-fir;
                // console.log(fir+"-"+row+"-"+lastSpace);
                var monthItem =  {
                    year:"",
                    month:"",
                    day:"",
                    firstDay:"",
                    selectDate:"",
                    selectIndex:-1,
                    monthDate:[]
                };
                for(var i = 0;i<row;i++){
                    var arr= [];
                    for(var j = 0;j<7;j++){
                        if (i == 0 && j<fir){
                            //第一行
                            arr.push("");
                        }else if(i == 0) {
                            //第一行
                            arr.push(j - fir + 1);
                        }else if (i==(row-1) && j>(6-lastSpace)){
                            //最后一行
                            arr.push("");
                        }else if (i==(row-1) && j<=(6-lastSpace)){
                            //最后一行
                            var value = 7*(row-1)+(j+1)-fir;
                            arr.push(value);
                        }else{
                            var value = 7*(i+1)-fir-6+j;
                            arr.push(value);
                        }
                    }
                    monthItem.monthDate.push(arr);
                }
                //日期合并
                monthItem.year = year;
                if (month< 10){
                    monthItem.month = "0" + month;
                }else{
                    monthItem.month = month;
                }
                if (dd <10){
                    monthItem.day = "0" + dd;
                }else{
                    monthItem.day = dd;
                }
                monthItem.firstDay = fir;
                //默认选中的是今天
                if(initFlag) {
                    monthItem.selectIndex = dd+fir-1;
                    monthItem.selectDate = monthItem.year +"-"+ monthItem.month +"-"+monthItem.day;
                    this.selectDate=monthItem.selectDate
                }
                return monthItem;
            },
            getPreMonth:function () {
                var preItem=this.showCalendarArray[0];
                var year = preItem.year; //获取当前日期的年份
                var month = preItem.month; //获取当前日期的月份
                var day = preItem.day; //获取当前日期的日
                var days = new Date(year, month, 0);
                days = days.getDate(); //获取当前日期中月的天数
                var year2 = year;
                var month2 = parseInt(month) - 1;
                if (month2 == 0) {
                    year2 = parseInt(year2) - 1;
                    month2 = 12;
                }
                var day2 = day;
                var days2 = new Date(year2, month2, 0);
                days2 = days2.getDate();
                if (day2 > days2) {
                    day2 = days2;
                }
                if (month2 < 10) {
                    month2 = '0' + month2;
                }
                var t2 = year2 + '-' + month2 + '-' + day2;
                var d = new Date(Date.parse(t2.replace(/-/g,   "/")));
                return this.initCalendarData(d);
            },
            getNextMonth:function (){
                var preItem=this.showCalendarArray[this.showCalendarArray.length-1];
                var year = preItem.year; //获取当前日期的年份
                var month = preItem.month; //获取当前日期的月份
                var day = preItem.day; //获取当前日期的日
                var days = new Date(year, month, 0);
                days = days.getDate(); //获取当前日期中的月的天数
                var year2 = year;
                var month2 = parseInt(month) + 1;
                if (month2 == 13) {
                    year2 = parseInt(year2) + 1;
                    month2 = 1;
                }
                var day2 = day;
                var days2 = new Date(year2, month2, 0);
                days2 = days2.getDate();
                if (day2 > days2) {
                    day2 = days2;
                }
                if (month2 < 10) {
                    month2 = '0' + month2;
                }
                var t2 = year2 + '-' + month2 + '-' + day2;
                var d = new Date(Date.parse(t2.replace(/-/g,   "/")));
                return this.initCalendarData(d);
            },
            changeItemColor:function (index,monthItem) {
                for(var i=0;i<this.showCalendarArray.length;i++) {
                    this.showCalendarArray[i].selectIndex=-1;
                }
                monthItem.selectIndex = index;
                var value  = index - this.firstDay +1;
                if (value <10){
                    monthItem.day = "0" + value;
                }else{
                    monthItem.day = value;
                }
                monthItem.selectDate = monthItem.year +"-"+ monthItem.month +"-"+monthItem.day;
                this.selectDate=monthItem.selectDate
            },
        }
    })
})()
