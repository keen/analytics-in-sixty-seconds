!function(name,path,ctx){
  var latest,prev=name!=='Keen'&&window.Keen?window.Keen:false;ctx[name]=ctx[name]||{ready:function(fn){var h=document.getElementsByTagName('head')[0],s=document.createElement('script'),w=window,loaded;s.onload=s.onerror=s.onreadystatechange=function(){if((s.readyState&&!(/^c|loade/.test(s.readyState)))||loaded){return}s.onload=s.onreadystatechange=null;loaded=1;latest=w.Keen;if(prev){w.Keen=prev}else{try{delete w.Keen}catch(e){w.Keen=void 0}}ctx[name]=latest;ctx[name].ready(fn)};s.async=1;s.src=path;h.parentNode.insertBefore(s,h)}}
}('Keen','https://d26b395fwzu5fz.cloudfront.net/keen-tracking-0.0.5.min.js',this);

Keen.ready(function(){

  var client = new Keen({
    projectId: "562664262fd4b1228bb8410a",
    writeKey: "e75fa8dce17fa192c2ed3da7f2d35cd30ebaab336d537c74a42278da8cac4ff11aea6d59c53791b48aae64bc0bd2222a24c9c63594021a8eab41e47c814e6e15d46315e7d6bfdaa1e411efdc9897238cf884b8bbe12f4cd7bc5b3cf2c9e09be2c456b15a43f161e9b458573240370614",
    readKey: "76c09eba8bd1815104d38f669debb29c00eb6edf4236e1173c2147e80689a14185006d343b60d7b8e1770a20b5fcda10648e0f36862c77f204983d7bd09d2f2b89d56e00aba19d31eccbc20746709ce408c9a565e4fc9d699de4fd3e6adb0c36ea65de1af1c5a51b05d7e91b1e628bda"
  })

  var sessionCookie = Keen.utils.cookie('a-cookie');
  if (!sessionCookie.get('user_id')) {
      sessionCookie.set('user_id', Keen.helpers.getUniqueId());
  }

  var sessionTimer = Keen.utils.timer();
  sessionTimer.start();

  // THE BIG DATA MODEL!

  client.extendEvents(function(){
      return {
          page: {
              title: document.title,
              url: document.location.href
              // info: {} (add-on)
          },
          referrer: {
              url: document.referrer
              // info: {} (add-on)
          },
          tech: {
              browser: Keen.helpers.getBrowserProfile(),
              // info: {} (add-on)
              ip: '${keen.ip}',
              ua: '${keen.user_agent}'
          },
          time: Keen.helpers.getDatetimeIndex(),
          visitor: {
              id: sessionCookie.get('user_id'),
              time_on_page: sessionTimer.value()
          },
          // geo: {} (add-on)
          keen: {
              timestamp: new Date().toISOString(),
              addons: [
                  {
                      name: 'keen:ip_to_geo',
                      input: {
                          ip: 'tech.ip'
                      },
                      output: 'geo'
                  },
                  {
                      name: 'keen:ua_parser',
                      input: {
                          ua_string: 'tech.ua'
                      },
                      output: 'tech.info'
                  },
                  {
                      name: 'keen:url_parser',
                      input: {
                          url: 'page.url'
                      },
                      output: 'page.info'
                  },
                  {
                      name: 'keen:referrer_parser',
                      input: {
                          page_url: 'page.url',
                          referrer_url: 'referrer.url'
                      },
                      output: 'referrer.info'
                  }
              ]
          }
      };
  });
  client.recordEvent('pageview');
});
