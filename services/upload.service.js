const formidable = require('formidable');
const path = require('path');
const fs = require('fs');

const filterMimetype = function ({ name, originalFilename, mimetype }) {
    if (!this.mimetypes.includes(mimetype)) {
        return new Error('Định dạng không hỗ trợ');
    }
    return mimetype && this.mimetypes.includes(mimetype);
};

/** parse form data
 *
 * @param {Request} req
 * @param {Enum} uploadDir
 * @param {[Enum]} mimetypes
 * @returns {Promise<Object>}
 */
const parseForm = (req, uploadDir, mimetypes) => {
    const uploadFolder = path.join(__dirname, `../public/uploads/${uploadDir}`);

    const form = formidable({
        multiples: true,
        filter: filterMimetype.bind({ mimetypes }),
        uploadDir: uploadFolder,
        keepExtensions: true,
        allowEmptyFiles: false,
    });

    return new Promise((resolve, reject) => {
        form.parse(req, function (err, fields, files) {
            if (err) {
                reject(err);
            }

            // console.log(fields, files);

            let documentFiles = files.image;

            if (!documentFiles) reject(new Error('Không tìm thấy file'));

            const isArray = Array.isArray(documentFiles);

            if (!isArray) {
                documentFiles = [documentFiles];
            }

            documentFiles.map((file) => {
                const pathFile = file.filepath;

                fs.rename(pathFile, uploadFolder, function (err) {
                    if (err) reject(err);
                });

                file.filepath = `/uploads/${uploadDir}/${path.basename(
                    pathFile
                )}`;

                return file;
            });

            resolve({ fields, ...files });
        });
    });
};

const uploadFile = async (req, uploadDir, mimetypes) => {
    return await parseForm(req, uploadDir, mimetypes);
};

module.exports = {
    parseForm,
    uploadFile,
};
