let Loader = {
    images: {},
    loadImage: function (key: string, src: string): Promise<any> {
        var img = new Image();

        var d = new Promise(function (resolve, reject) {
            img.onload = function () {
                Loader.images[key] = img;
                resolve(img);
            };

            img.onerror = function () {
                reject('Could not load image: ' + src);
            };
        });

        img.src = src;
        return d;
    },
    getImage: function (key: string) {
        return (key in Loader.images) ? Loader.images[key] : null;
    },
};

export default Loader;