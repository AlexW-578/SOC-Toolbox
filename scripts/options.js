if (typeof browser == "undefined") {
    // Chrome does not support the browser namespace yet.
    globalThis.browser = chrome;
}

const saveOptions = () => {
    const email_dir = document.getElementById('email_dir').value;
    const PDF_dir = document.getElementById('PDF_dir').value;
    const csv_dir = document.getElementById('csv_dir').value;
    const zip_dir = document.getElementById('zip_dir').value;
    const json_dir = document.getElementById('json_dir').value;
    const download_manager = document.getElementById('Download_Manager').checked;
    const status = document.getElementById('status');

    browser.storage.local.set(
        {
            email_directory: email_dir,
            PDF_directory: PDF_dir,
            csv_dir: csv_dir,
            zip_dir: zip_dir,
            json_dir: json_dir,
            download_manager: download_manager,
        },
        () => {
            // Update status to let user know options were saved.
            status.textContent = `Options saved.`;
            setTimeout(() => {
                status.textContent = '';
            }, 1000);
        }
    );
};

const clearOptions = () => {
    browser.storage.sync.clear(() => {
        const status = document.getElementById('status');
        status.textContent = 'Options Cleared.';
        setTimeout(() => {
            status.textContent = '';
        }, 750);
    });
};

const loadPage = () => {
    browser.storage.local.get(
        {
            email_directory: '',
            PDF_directory: '',
            csv_dir: '',
            zip_dir: '',
            json_dir: '',
            download_manager: false,
        },
        (items) => {
            document.getElementById('email_dir').value = items.email_directory;
            document.getElementById('PDF_dir').value = items.PDF_directory;
            document.getElementById('csv_dir').value = items.csv_dir;
            document.getElementById('zip_dir').value = items.zip_dir;
            document.getElementById('json_dir').value = items.json_dir;
            document.getElementById('Download_Manager').checked = items.download_manager;

        }
    );
};
document.addEventListener('DOMContentLoaded', loadPage);
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('clear').addEventListener('click', clearOptions);


