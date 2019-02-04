var FilterShow = (function () {
    function FilterShow(el,listel) {
        var newsJson = new Array();
        var newfilterJson = new Array();
        this.el = el;
        this.listClick = listel;
        this.url = listel.url;
        this.fel = listel.firstClick;
        this.sel = listel.secondClick;
        this.tel = listel.thirdClick;
        this.lel= listel.loadMore;
        this.init();
    }

    FilterShow.prototype.init = function () {
        this.loadmore = 12;
        this.intialstate = 0;
        this.categoryText = 'All';
        this.yearText = 'All';
        this.dropText = 'ASC';
        this.counter = 0;
        this.method();
        this.categoryClick();
        this.yearClick();
        this.ArrangeOrder();
        this.loadMore();
    }

    FilterShow.prototype.method = function () {
        var _self = this;
        var promise = fetch(_self.url);
        promise.then(function (response) {
            return response.json();
        }).then(function (data) {
            newsJson = data;
            newfilterJson = newsJson;
            _self.repeatMethod(newsJson);
            return newsJson;
        }).catch(function (error) {
            console.log("Json not loaded:" + error);
        });
    };

    FilterShow.prototype.repeatMethod = function (data) {
        var _self = this;
        if (data.length === 0) {
            return jQuery(_self.el).append('<div class="no-item"><h4>No item found</h4></div>')
        }
        data.slice(_self.intialstate, _self.loadmore).map(function (item, i) {
            jQuery(_self.el).append('' +
                '<div class="col-sm-12 col-md-4 col-lg-4 card-wrapper wow fadeInUp news" data-wow-delay="' + (i + 3) / 10 + 's">' +
                '<a href="' + item.post_url + '">' +
                '<div class="card card-content">' +
                '<div class="card-img-top img-wrapper">' +
                '<img src="' + item.background.image + '" alt="' + item.background.alt + '">' +
                '</div>' +
                '<div class="card-body text-content">' +
                '<span class="card-subtitle">' + item.post_date + '</span>' +
                '<h5 class="card-title">' + item.post_heading + '</h5>' +
                '<p class="card-text">' + item.post_blurb + '</p>' +
                '</div>' +
                '</div>' +
                '</a>' +
                '</div>')
        });
    }

    FilterShow.prototype.categoryClick = function () {
        var _self = this;
        $(_self.fel).on('click', function () {
            $(this).parent().children().removeClass('active');
            $(this).addClass('active');
            _self.categoryText = $(this).text();
            _self.filterElement();
        });
    }

    FilterShow.prototype.yearClick = function () {
        var _self = this;
        $(_self.sel).on('click', function () {
            $(this).parent().children().removeClass('active');
            $(this).addClass('active');
            _self.yearText = $(this).text();
            _self.filterElement();
        });

    }

    FilterShow.prototype.ArrangeOrder = function () {
        var _self = this;
        $(_self.tel).on('click', function () {
            _self.dropText = $(this).text();
            this.newText = $(this).parents('.sort-div').find('span').text();
            $(this).parents('.sort-div').find('span').text(_self.dropText);
            $(this).parent().children().removeClass('drop-active');
            $(this).addClass('drop-active');
            if(this.newText === _self.dropText)
                return false;
            _self.filterElement();
        });
    };

    FilterShow.prototype.loadMore = function () {
        var _self = this;
        $(_self.lel).on('click', function (e) {
            e.preventDefault();
            _self.intialstate = _self.loadmore;
            _self.loadmore += 12;
            _self.repeatMethod(newfilterJson);
            _self.loadMoreHide(_self.loadmore);
        });
    }

    FilterShow.prototype.loadMoreHide = function (loadmore) {
        var _self = this;
        if (loadmore > (newfilterJson.length - 1)) {
            $('body .blog-landing .load-more').css('display', 'none');
        }
        else {
            $('body .blog-landing .load-more').css('display', '');
        }
    }

    FilterShow.prototype.beforeInit = function () {
        var _self = this;
        _self.loadmore = 12;
        _self.intialstate = 0;
        newfilterJson = [];
    }

    FilterShow.prototype.afterInit = function () {
        var _self = this;
        if (_self.dropText === 'DSC' && !_self.counter) {
            newfilterJson.reverse();
            _self.counter = 1;
        }
        else if (_self.counter && _self.dropText === 'ASC') {
            newfilterJson.reverse();
            _self.counter = 0;
        }
        jQuery(_self.el).find('> div').remove();
        _self.repeatMethod(newfilterJson);
        _self.loadMoreHide(_self.loadmore);
    }

    FilterShow.prototype.switchCond = function(){

        switch (element) {
            case 1:

        }
    }

    FilterShow.prototype.filterElement = function () {
        var _self = this;
        _self.beforeInit();
        newsJson.filter(function (item) {
            var arr = item.post_date.split(',');
            if (_self.categoryText === 'All' && _self.yearText === 'All') {
                newfilterJson = this.newsJson;
                return newfilterJson;
            }
            else if ((item.category === _self.categoryText) && _self.yearText === 'All') {
                newfilterJson.push(item);
            }
            else if ((parseInt(arr[1]) == _self.yearText) && _self.categoryText === 'All') {
                newfilterJson.push(item);
            }
            else if ((item.category === _self.categoryText) && (parseInt(arr[1]) == _self.yearText)) {
                newfilterJson.push(item);
            }
        });
        _self.afterInit();
    }

    return FilterShow;
}());

(function ($) {
    $.fn.scriptFilters = function (options) {
        // Default options
        return this.each(function () {
            var settings = $.extend({
                url: '',
                firstClick: '$(.filter-nav .filter-inner > ul > li)',
                secondClick: '',
                thirdClick: '',
                loadMore: $(this).find('.load-more')
            }, options);
            var item = new FilterShow(this, settings);
        });
    }

    jQuery('.blog-landing .card-outer').scriptFilters({
        url: 'new.json',
        firstClick: $('.blog-landing .filter-nav .filter-inner .category > li'),
        secondClick: $('.blog-landing .filter-nav .filter-inner .years > li'),
        thirdClick: $('.blog-landing .filter-nav .sort-div > ul > li > ul > li'),
        loadMore: $('.blog-landing .load-more')
    });

    $('body .blog-landing .filter-nav .sort-div > ul > li').on('click', function () {
        $(this).toggleClass('active');
    });
})(jQuery);

