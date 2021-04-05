(()=>{var t={497:t=>{function e(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function r(t){for(var r=1;r<arguments.length;r++){var i=null!=arguments[r]?arguments[r]:{};r%2?e(Object(i),!0).forEach((function(e){n(t,e,i[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(i)):e(Object(i)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(i,e))}))}return t}function n(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function i(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t)){var r=[],n=!0,i=!1,a=void 0;try{for(var u,o=t[Symbol.iterator]();!(n=(u=o.next()).done)&&(r.push(u.value),!e||r.length!==e);n=!0);}catch(t){i=!0,a=t}finally{try{n||null==o.return||o.return()}finally{if(i)throw a}}return r}}(t,e)||a(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function a(t,e){if(t){if("string"==typeof t)return u(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?u(t,e):void 0}}function u(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}var o=function(t,e){return e[t%10==1&&t%100!=11?0:t%10>=2&&t%10<=4&&(t%100<10||t%100>=20)?1:2]},c=function(t,e){return t.valueText===e.valueText?t.name.localeCompare(e.name):e.valueText.localeCompare(t.valueText,"ru-u-kn-true")},f=function(t,e){for(var r=i(e,2),n=r[0],o=r[1],c={Comment:[],Commit:[],Issue:[],Project:[],Sprint:[],Summary:[],User:[]},f=t.filter((function(t){return"Commit"===t.type})),l=t.filter((function(t){return"Issue"===t.type||"Comment"===t.type?t.createdAt>=n&&t.createdAt<=o:"Commit"===t.type?t.timestamp>=n&&t.timestamp<=o:t})),m=function(){var t,e=i(d[s],2),r=e[0],n=e[1];n.push.apply(n,function(t){if(Array.isArray(t))return u(t)}(t=l.filter((function(t){return t.type===r})))||function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(t)||a(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}())},s=0,d=Object.entries(c);s<d.length;s++)m();return{commitEntities:f,preparedEntities:c}},l=function(t,e){var i=t[e].reduce((function(t,e){return r(r({},t),{},n({},e.author,[]))}),{});return t[e].forEach((function(t){var r="Commit"===e?t.summaries:t.likes;Array.isArray(r)&&r.length&&i[t.author].push(r)})),t.User.map((function(t){var r=o(i[t.id].flat().length,["голос","голоса","голосов"]),n=Array.isArray(i[t.id])&&i[t.id].length?"".concat(i[t.id].length):"0",a=Array.isArray(i[t.id])&&i[t.id].length?"".concat(i[t.id].flat().length," ").concat(r):"0 голосов";return{id:t.id,name:t.name,avatar:t.avatar,valueText:"Commit"===e?n:a}})).sort(c)},m=function(t){var e=t.Commit.map((function(t){return t.summaries})).flat(),i=t.Summary.filter((function(t){var r=t.id;return e.includes(r)})).reduce((function(t,e){var i=e.id,a=e.added,u=e.removed;return r(r({},t),{},n({},i,{sum:a+u}))}),{});return t.Commit.map((function(t){return r(r({},t),{},{summariesValue:t.summaries.map((function(t){return r({},i[t])})).reduce((function(t,e){return t+e.sum}),0)})}))},s=function(t){var e=t.filter((function(t){return t.summariesValue>=1001})),r=t.filter((function(t){return t.summariesValue>=501&&t.summariesValue<=1e3})),n=t.filter((function(t){return t.summariesValue>=101&&t.summariesValue<=500})),i=t.filter((function(t){return t.summariesValue>=1&&t.summariesValue<=100}));return[e.length,r.length,n.length,i.length]};t.exports={prepareData:function(t,e){var a=e.sprintId,u=t.filter((function(t){return"Sprint"===t.type})).find((function(t){return t.id===a})),c=t.filter((function(t){return"Sprint"===t.type})).find((function(t){return t.id===a-1})),d=[u.startAt,u.finishAt],p=[c.startAt,c.finishAt],y=f(t,d),v=y.commitEntities,h=y.preparedEntities,b=f(t,p),g=function(t,e,a){for(var u=e.reduce((function(t,e){return r(r({},t),{},n({},e.id,[]))}),{}),o=e.reduce((function(t,e){return r(r({},t),{},n({},e.id,[e.startAt,e.finishAt]))}),{}),c=function(){var e=i(l[f],2),r=e[0],n=e[1],a=t.filter((function(t){return t.timestamp>=n[0]&&t.timestamp<=n[1]}));u[r].push(a)},f=0,l=Object.entries(o);f<l.length;f++)c();return e.map((function(t){var e={title:t.id.toString(),hint:t.name,value:u[t.id][0].length};return t.id===a&&(e.active=!0),e})).sort((function(t,e){return t.title.localeCompare(e.title,"ru-u-kn-true")}))}(v,h.Sprint,a),O=function(t){for(var e={sun:{},mon:{},tue:{},wed:{},thu:{},fri:{},sat:{}},n=t.map((function(t){return r(r({},t),{},{day:new Intl.DateTimeFormat("en-Us",{weekday:"short"}).format(new Date(t.timestamp)).toLocaleLowerCase(),hour:new Date(t.timestamp).getHours()})})),a=function(){var t=i(o[u],2),r=t[0],a=t[1];n.filter((function(t){return t.day===r})).map((function(t){return t.hour})).forEach((function(t){e[r][t]=(e[r][t]||0)+1})),e[r]=new Array(24).fill(0).map((function(t,e){return a[e]?t=a[e]:t}))},u=0,o=Object.entries(e);u<o.length;u++)a();return e}(h.Commit),j=function(t,e){var r=m(t),n=m(e),i=r.length-n.length,a=s(r),u=s(n),c=function(t){return a[t]-u[t]},f=function(t){return o(t,["коммит","коммита","коммитов"])},l=function(t){return"".concat(a[t]," ").concat(f(a[t]))},d=function(t){return"".concat(c(t)>0?"+":"").concat(c(t)," ").concat(f(Math.abs(a[t])))};return{diagramCategoriesData:[{title:"> 1001 строки",valueText:l(0),differenceText:d(0)},{title:"501 — 1000 строк",valueText:l(1),differenceText:d(1)},{title:"101 — 500 строк",valueText:l(2),differenceText:d(2)},{title:"1 — 100 строк",valueText:l(3),differenceText:d(3)}],difference:i}}(h,b.preparedEntities),A=j.diagramCategoriesData,x=j.difference;return[{alias:"leaders",data:{title:"Больше всего коммитов",subtitle:u.name,emoji:"👑",users:l(h,"Commit")}},{alias:"vote",data:{title:"Самый 🔎 внимательный разработчик",subtitle:u.name,emoji:"🔎",users:l(h,"Comment")}},{alias:"chart",data:{title:"Коммиты",subtitle:u.name,values:g,users:l(h,"Commit")}},{alias:"diagram",data:{title:"Размер коммитов",subtitle:u.name,totalText:"".concat(h.Commit.length," коммита"),differenceText:"".concat(x>0?"+":"-").concat(Math.abs(x)," с прошлого спринта"),categories:A}},{alias:"activity",data:{title:"Коммиты, 1 неделя",subtitle:u.name,data:O}}]}}}},e={};!function r(n){var i=e[n];if(void 0!==i)return i.exports;var a=e[n]={exports:{}};return t[n](a,a.exports,r),a.exports}(497)})();