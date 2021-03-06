'use strict';
const gulp = require('gulp');

//Понятия:
//Модуль - gulp модуль выполняющий задачи одного типа

//Если переменная dev = true то это разработка а если false то продакшин

//Есть 5 типов опций:
//1. Глобальный который распространяеться на все задачи (задаёться в свойстве "general")
//2. Для модулей работающих на уровне всего приложения (задаються в свойстве "common_modules")
//3. Для всех обычных модулей (задаються в свойстве "all_casual_modules")
/*4. Для модуля задач одного типа (задаёться в свойстве casual_modules и свойстве с именем модуля).
* Знак "•" в начале комментарий свойств обозначает те свойства которые управляют режимами работы задач или этого плагина (помечаються на том уровне на котором используються)
* Знак "&" означает что они общие для нескольких модулей и их лучше задавать в "all_casual_modules" или "general".
* Знак "↓" означает что эти свойства рекомендуеться задавать отдельно для каждой конкретной задачи*/
//5. Для каждой обычной задачи (задаються объектами в свойстве с именем модуля)

//Задачи задаються в свойствах имеющие имена модулей. Потдерживаемые модули: html, css, js, images, copy
//Есть 3 формата задания задач:
//1. Просто обьект с настройками если задача одна
//2. массиив объектов задач если надо разные файлы по разному обработать
/*3. Можно в массиве задач заместо объектов настроек передавать массивы объектов настроек связанных задач. Если определнные файлы были обработаны связанной задачей то в последующие связанные задачи в рамках одного массива они непопадут
* Запомните! Вначале надо определять задачи с более частными шаблонами файлов а потом с более общими, наподобие системы роутинга в php фреймворках. Потому что если передать
* в начале более общий шаблон то файлы всегда будут попадать в эту задачу и никогда непопадут в следующую задачу с более частным шаблоном*/

require('easy-gulp-by-orel')(function(dev) {
return {
    general: {
        base_src: 'src',              // (String: "путь"       Def:"."). Базовый путь к папке с исходниками
        base_tmp: 'tmp',              // (String: "путь"       Def:"."). Базовый путь к папке с временными файлами
        base_dest: 'public',          // (String: "путь"       Def:"."). Базовый путь к папке с конечным результатом

        //Установите сохранение каждую 1 сек, если пользуетесь редактором phpshtorm (File | Settings | Appearance and Behavior | System Settings | Save files automatically if application is idle for 1 sec)
        watch: dev                    //• (boolean: true|false, Def:false). Наблюдение за изменениями файлов и перекомпиляция на лету.
    },
    
    common_modules: {
        clean: true,                  //• (boolean: true|false, Def:false). Уничтожает папки "base_tmp", "base_dest" перед запуском основных задач

        browserSync: dev,             //• (boolean: true|false, Def:false). Обновляет на лету вёрстку в браузере если изменились файлы. Синхронизирует действия в нескольких браузерах, что позволяет тестировать вёрстку одновременно в нескольких браузерах. Позволяет тестировать вёрстку на мобильных через WIFI
        browserSyncOptions: {},       //  (object: for browser-sync plugin, Def:notdocumented). По умолчанию задаються разные опции при разных настройках

        adaptivePixelPerfect: dev,    //• (boolean: true|false, Def:false). Эмулирает вёрстку при разных разрешениях и подкладывает под неё картинку дизайна соответствующую этому разрешению. Синхронизирует действия в нескольких браузерах, что позволяет тестировать вёрстку одновременно в нескольких браузерах. Пока что не позволяет тестировать вёрстку на мобильных через WIFI!!!
        adaptivePixelPerfectOptions: {
            port: 3010,               // (int: \d{4},          Def:3010). Порт по которому создаёться альтернативная страница плагина помимо browser-sync
            design: "design"          // (String: "путь"       Def:"design"). Путь к папке с картинками дизайна
        }
    },
    
    all_casual_modules: {
        changed: dev,                //• (boolean: true|false, Notdef). Обрабатывать только те файлы которые изменились
        minification: !dev,          //• (boolean: true|false, Notdef). Минификация файлов
        sourcemaps: dev              //• (boolean: true|false, Notdef). Sourcemaps файлы
    },

    //У всех модулей есть следующие опции:
        //watch             //• (boolean: true|false, Def:false). Наблюдение за изменениями файлов и перекомпиляция на лету.
        //name              // ↓(String: "имя задачи" Notdef)
        //src               // ↓(minimatch patterns   Notdef). Откуда брать файлы (относительно "base_src").
        //dest              // ↓(String: "путь"       Def: ""). Куда ложить html (относительно "base_dest")
        //addWatch          // ↓(Boolean: false | String: "путь" Def: false). Добавляет в наблюдение файлы. При изменении файлов просто выполняет задачу без обработки этих файлов (относительно "base_src")
        //disabled          //•↓(boolean: true|false | String: "files-consider", Def:false). Отменяет задачу - возможно понадобиться с использованием переменной dev - если хотите чтоб в зависимых задачах файлы учитывались и непропускались как при включённом режиме то передайте строку "files-consider"
    
    casual_modules: {
        //Потдерживаються форматы: html, htm, pug
        html: {
            seedingData: "seeding-data.json", //  (Boolean: false | String: "путь" Def:false). json файл в котором храняться вспомогательные контентные данные например: текст имён ссылок и/или текст постов. Эти данные будут переданы во все pug и (html обрабатываемые модулем gulp-file-include) файлы... (относительно "base_src").
            fileInclude: false,       //•↓(boolean: true|false, Def:false). Плагин который просто подключает одни html файлы (с часто используемыми частями кода, например header и footer) в обрабатываемый
            fileIncludeOptions: {     // ↓(object: for gulp-file-include plugin Def:{prefix: '@@', basepath: '@file'}).
                prefix: '@@',         //  (String:              Def: "@@"). Префикс перед include, пример: @@include('./header.html')
                basepath: '@file'     //  (String: "относительный путь" Def: "@file"). Относительно чего искать подключаемый файл. По умолчанию: относительно текущего обрабатываемого файла
            },
            pug: true,                //•↓(boolean: true|false, Def:true). Включить pug. Установите "Pug (ex-Jade)" плагин если используете редактор phpshtorm
            pugOptions: {
                pretty: '  '          //  (String:              Def: "\t"). Какими отступами должны делаться вложенные теги при компиляции в html. По умолчанию: табуляция
            },
            //changed: true,          // &(boolean: true|false, Def:true). Обрабатывать только те файлы которые изменились
            sourcemaps: false         // &(boolean: true|false, Def:false). Sourcemaps файлы
        },

        //Потдерживаються форматы: sass, scss, less, styl, css
        css: {
            autoprefixer: true,       //• (boolean: true|false, true). Вендорные префиксы, чтобы больше браузеров использовали современные фишки пускай даже иногда с небольшими багами. Например -webkit-transition:
            autoprefixerOptions: {    //  (object: for gulp-autoprefixer plugin Def:{browsers: ['last 2 versions'], cascade: false}). Смотрите подробно тут: //https://github.com/ai/browserslist
                browsers: ['last 10 versions', "Firefox > 40"],
                cascade: false
            }
            //changed: true,          // &(boolean: true|false, Def:true). Обрабатывать только те файлы которые изменились
            //sourcemaps: false,      // &(boolean: true|false, Def:false). Sourcemaps файлы
            //minification: true      //  (boolean: true|false, true). Минификация файлов
        },

        //Потдерживаються форматы: js, coffee
        js: {
            coffeeOptions: {          //• (object: for gulp-coffee plugin, Def:{bare: true}).
                bare: true
            },
            //changed: true,          // &(boolean: true|false, Def:true). Обрабатывать только те файлы которые изменились
            //sourcemaps: false,      // &(boolean: true|false, Def:false). Sourcemaps файлы
            minification: false      //  (boolean: true|false, true). Минификация файлов
        },

        //Потдерживаються форматы: jpg, png, gif, svg
        //webp всеравно жмёться алгоритмом с потерями при "perfect" (решение автора плагина)
        //Этот метод создание спрайта svg основан на - http://glivera-team.github.io/svg/2016/06/13/svg-sprites-2.html. В этом методе нельзя управлять иконками через js, если вам это нужно то контет картинок внедряйте в html. Для лучшей потдержки старых браузеров (https://github.com/jonathantneal/svg4everybody)
        //Отображать svg иконки в проводнике windows - http://savvateev.org/blog/54/
        images: {
            //changed: true,          // &(boolean: true|false,                 Def:true). Обрабатывать только те картинки которые изменились
            quality: "simple",        //• (String: "perfect" | "good" | "simple" | "low", Def: "simple").
            qualityFolders: true,
            webp: false,               //• (boolean: true|false,                 Def:false). Все картинки дополнительно жмуться в формат webp и вставляються в ту же папку с такими же именами. Вставьте в ваш .htaccess файл код с этой статьи: https://github.com/vincentorback/WebP-images-with-htaccess. Для потдержки webp
            sprite: false,            //•↓(boolean: true|false,                 Def:false). Просто жмём картинки или создаём спрайт.
            spriteOptions: {
                styleFormat: 'sass',             //  (String: "расширение файла"           Def: "sass"). Для препроцессора стилей в котором будут данные о спрайте
                destStyle: 'sass',               //  (String: "путь"                       Def: "sass"). Для файла препроцессора стилей в котором будут данные о спрайте (относительно "base_tmp")
                relStyleToImg: '../img', //  (String: "относительный путь"         Def: ""). Путь относительно откомпилированного файла стилей с данными о спрайте к картинке спрайту
                destExamples: 'sprite-examples', //  (Boolean: false | String: "путь"      Def: "sprite-examples"). Папка в которую поместить полезные миксины и примеры вывода стилей и html для отдельных иконок из спрайтов. (относительно "base_tmp")
                png: {
                    prefixIcon: "icon-",         //  (String: "имя файла"                  Def: "icon__"). Префикс к именам иконок спрайта - используеться в формировании классов стилей иконок
                    postfix2x: false,            //• (Boolean: false | String: "имя файла" Def: false). Конец имени файлов с двойным разрешением для создания спрайта для ретины или 4k. "-2x" с такой строкой возникают баги!!!
                    name: 'sprite',              // ↓(String: "имя файла"                  Def: "sprite"). Картинка спрайта
                    styleName: '_png-sprite'     // ↓(String: "имя файла"                  Def: "_png-sprite"). Стили с данными об иконках спрайта
                },
                svg: {
                    prefixIcon: "icon-",         //  (String: "имя файла"                  Def: "svg-icon__"). Префикс к именам иконок спрайта - используеться в формировании классов стилей иконок и идентификаторов в тегах symbol в svg
                    clearColor: false,           //• (boolean: true|false,                 Def:false). Удаление атрибутов цвета чтобы можно было цвет svg иконки задавать через свойство color в стилях
                    name: 'sprite',              // ↓(String: "имя файла"                  Def: "sprite"). Картинка спрайта
                    styleName: '_svg-sprite'     // ↓(String: "имя файла"                  Def: "_png-sprite"). Стили с данными об иконках спрайта
                }
            }
        }
    },

    html: [
        [
            {name: 'pug', src: ['*.pug'], addWatch: ['layouts/*.pug', "seeding-data.json"], sourcemaps: false},
            {name: 'html', src: ['/**/*.{html,htm}'], sourcemaps: false}
        ]
    ],

    css: [
        [
            {name: 'sass', src: ['sass/*{styles,normalize,our}.sass'], addWatch: ["sass/*{mixing,constant}.sass", "../tmp/sass/png-sprite.sass"], dest: 'styles'}
        ],
        {name: 'css', src: ['/**/*.css']}
    ],

    js: [
        {name: 'coffee', src: 'coffee/*.coffee', addWatch: "coffee/**/*.coffee", dest: 'js'},
        {name: 'js', src: '/**/*.js'}
    ],

    images: [
        [
            {name: 'images-sprites', src: ['img/icons/**/*.{png,svg}'], quality: "good", dest: 'img', sprite: true,
                spriteOptions:{
                    png: {name: 'sprite', styleName: '_png-sprite'},
                    svg: {name: 'sprite', styleName: '_svg-sprite'}}},
            {name: 'images-good', src: ['img/{header__eagle-bottom,header__map-bottom}.jpg'], quality: "good", dest: "img"},
            {name: 'images-good-2', src: ['img/trash/{consumers,annual-report-start,development-report-start}.jpg'], quality: "good", dest: "img/trash"},
            {name: 'images-png-low', src: ['/**/*.png'], quality: "low"},
            {name: 'images', src: ['/**/*.{jpg,jpeg,png,gif,svg}']}
        ]
    ],

    copy: {name: 'copy', src: ['/**/*.{webp,ico,otf,eot,ttf,woff,woff2}']}
};
});

gulp.task('default', ['easy:gulp:by:orel']);
gulp.task('production', ['easy:gulp:by:orel:production']);