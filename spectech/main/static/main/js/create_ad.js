document.addEventListener('DOMContentLoaded', function () {
    // Элементы DOM
    const form = document.getElementById('rental-form');
    const steps = document.querySelectorAll('.form-step');
    const stepIndicators = document.querySelectorAll('.step-indicator');
    const progressBar = document.getElementById('progress-bar');
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    const cardOptions = document.querySelectorAll('.card-option');
    const btnOptions = document.querySelectorAll('.btn-option');
    const imageUpload = document.getElementById('image-upload');
    const fileInput = document.getElementById('file-input');
    const imagePreview = document.getElementById('image-preview');
    const summaryImages = document.getElementById('summary-images');
    const yearSelect = document.getElementById('year');

    // Текущий шаг
    let currentStep = 1;

    // Заполнение годов выпуска
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1990; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }

    // Выбор карточки
    cardOptions.forEach(option => {
        option.addEventListener('click', function () {
            cardOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    // Выбор кнопки-опции
    btnOptions.forEach(option => {
        option.addEventListener('click', function () {
            // Снимаем выделение с других кнопок в той же группе
            const parent = this.parentElement;
            const siblings = parent.querySelectorAll('.btn-option');
            siblings.forEach(sib => sib.classList.remove('selected'));

            // Выделяем текущую кнопку
            this.classList.add('selected');
        });
    });

    // Переход к следующему шагу
    nextButtons.forEach(button => {
        button.addEventListener('click', function () {
            const nextStep = parseInt(this.getAttribute('data-next'));
            if (validateStep(currentStep)) {
                goToStep(nextStep);
            }
        });
    });

    // Возврат к предыдущему шагу
    prevButtons.forEach(button => {
        button.addEventListener('click', function () {
            const prevStep = parseInt(this.getAttribute('data-prev'));
            goToStep(prevStep);
        });
    });

    // Загрузка изображений
    imageUpload.addEventListener('click', function () {
        fileInput.click();
    });

    fileInput.addEventListener('change', function () {
        const files = this.files;
        if (files) {
            Array.from(files).forEach(file => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();

                    reader.onload = function (e) {
                        const previewItem = document.createElement('div');
                        previewItem.className = 'preview-item';

                        const img = document.createElement('img');
                        img.src = e.target.result;

                        const removeBtn = document.createElement('div');
                        removeBtn.className = 'remove';
                        removeBtn.innerHTML = '×';
                        removeBtn.addEventListener('click', function () {
                            previewItem.remove();
                        });

                        previewItem.appendChild(img);
                        previewItem.appendChild(removeBtn);
                        imagePreview.appendChild(previewItem);
                    };

                    reader.readAsDataURL(file);
                }
            });
        }
    });

    // Отправка формы
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (validateStep(currentStep)) {
            // В реальном приложении здесь будет отправка данных на сервер
            alert('Объявление успешно создано! В реальном приложении данные будут отправлены на сервер.');
            // Сброс формы и возврат к первому шагу
            form.reset();
            imagePreview.innerHTML = '';
            resetSelections();
            goToStep(1);
        }
    });

    // Функция перехода к указанному шагу
    function goToStep(step) {
        // Скрыть текущий шаг
        document.getElementById(`step-${currentStep}`).classList.remove('active');
        stepIndicators[currentStep - 1].classList.remove('active');

        // Показать новый шаг
        document.getElementById(`step-${step}`).classList.add('active');
        stepIndicators[step - 1].classList.add('active');

        // Обновить прогресс-бар
        const progressWidth = (step - 1) * (100 / 3);
        progressBar.style.width = `${progressWidth}%`;

        // Обновить индикаторы шагов
        stepIndicators.forEach((indicator, index) => {
            if (index < step - 1) {
                indicator.classList.add('completed');
            } else {
                indicator.classList.remove('completed');
            }
        });

        // Обновить сводку на последнем шаге
        if (step === 4) {
            updateSummary();
        }

        currentStep = step;
    }

    // Функция валидации шага
    function validateStep(step) {
        let isValid = true;

        if (step === 1) {
            const category = document.querySelector('.card-option.selected');
            const brand = document.getElementById('brand').value;

            if (!category || !brand) {
                isValid = false;
                alert('Пожалуйста, выберите тип и марку техники.');
            }
        } else if (step === 2) {
            const condition = document.querySelector('.btn-group .btn-option.selected');
            const year = document.getElementById('year').value;

            if (!condition || !year) {
                isValid = false;
                alert('Пожалуйста, укажите состояние и год выпуска техники.');
            }
        } else if (step === 3) {
            const price = document.getElementById('price').value;
            const location = document.getElementById('location').value;
            const minPeriod = document.querySelector('#step-3 .btn-group .btn-option.selected');

            if (!price || !location || !minPeriod) {
                isValid = false;
                alert('Пожалуйста, укажите стоимость, местоположение и минимальный срок аренды.');
            }
        } else if (step === 4) {
            const contactPhone = document.getElementById('contact-phone').value;
            const agreeTerms = document.getElementById('agree-terms').checked;

            if (!contactPhone || !agreeTerms) {
                isValid = false;
                alert('Пожалуйста, укажите телефон для связи и примите условия использования.');
            }
        }

        return isValid;
    }

    // Функция обновления сводки на последнем шаге
    function updateSummary() {
        const categoryOption = document.querySelector('.card-option.selected');
        document.getElementById('summary-category').textContent =
            categoryOption ? categoryOption.querySelector('.option-title').textContent : '-';

        document.getElementById('summary-brand').textContent =
            document.getElementById('brand').options[document.getElementById('brand').selectedIndex].text;

        const conditionOption = document.querySelector('#step-2 .btn-option.selected');
        document.getElementById('summary-condition').textContent =
            conditionOption ? conditionOption.textContent : '-';

        document.getElementById('summary-year').textContent =
            document.getElementById('year').value || '-';

        const price = document.getElementById('price').value;
        const period = document.getElementById('period').options[document.getElementById('period').selectedIndex].text;
        document.getElementById('summary-price').textContent =
            price ? `${price} ₽ ${period}` : '-';

        document.getElementById('summary-location').textContent =
            document.getElementById('location').value || '-';

        // Обновление изображений в сводке
        summaryImages.innerHTML = '';
        const previewItems = imagePreview.querySelectorAll('.preview-item');
        if (previewItems.length === 0) {
            summaryImages.innerHTML = '<span style="color: var(--dark-gray);">Нет загруженных изображений</span>';
        } else {
            previewItems.forEach(item => {
                const imgSrc = item.querySelector('img').src;
                const summaryImage = document.createElement('div');
                summaryImage.className = 'summary-image';

                const img = document.createElement('img');
                img.src = imgSrc;

                summaryImage.appendChild(img);
                summaryImages.appendChild(summaryImage);
            });
        }
    }

    // Сброс выделенных элементов
    function resetSelections() {
        cardOptions.forEach(opt => opt.classList.remove('selected'));
        btnOptions.forEach(opt => opt.classList.remove('selected'));
    }
});