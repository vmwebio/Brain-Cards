import { createCategory } from './components/createCategory.js';
import { createEditCategory } from './components/createEditCategory.js';
import { createHeader } from './components/createHeader.js';
import { createPairs } from './components/createPairs.js';
import { showAlert } from './components/showAlert.js';
import { createElement } from './helper/createElement.js';
import { fetchCards, fetchCategories, fetchCreateCategory, fetchDeleteCategory, fetchEditCategory } from './service/api.service.js';

// Основная функция инициализации приложения
const initApp = async () => {
  const headerParent = document.querySelector('.header');
  const app = document.querySelector('#app');

  // Создаем объекты компонентов
  const headerObj = createHeader(headerParent);
  const categoryObj = createCategory(app);
  const editCategoryObj = createEditCategory(app);
  const pairsObj = createPairs(app);

  // Функция для отключения всех секций
  const allSectionUnmount = () => {
    [categoryObj, editCategoryObj, pairsObj].forEach(obj => obj.unmount());
  }

  // Обработчик POST-запроса для создания новой категории
  const postHandler = async () => {
    const data = editCategoryObj.parseData();
    const dataCategories = await fetchCreateCategory(data);

    if (dataCategories.error) {
      showAlert(dataCategories.error.message);
      return;
    }

    showAlert(`Новая категория ${data.title} была добавлена`);
    allSectionUnmount();
    headerObj.updateHeaderTitle('Категории');
    categoryObj.mount(dataCategories);
  }

  // Обработчик PATCH-запроса для обновления категории
  const patchHandler = async () => {
    const data = editCategoryObj.parseData();
    const dataCategories = await fetchEditCategory(
      editCategoryObj.btnSave.dataset.id,
      data,
    );
    if (dataCategories.error) {
      showAlert(dataCategories.error.message);
      return;
    }

    showAlert(`Категория ${data.title} обновлена`);
    allSectionUnmount();
    headerObj.updateHeaderTitle('Категории');
    categoryObj.mount(dataCategories);
  }


  // Функция для отображения списка категорий
  const renderIndex = async e => {
    e?.preventDefault();
    allSectionUnmount();
    const categories = await fetchCategories();
    headerObj.updateHeaderTitle('Категории');
    if (categories.error) {
      const errorText = createElement('p', {
        className: 'server-error',
        textContent: 'Ошибка сервера, попробуйте зайти позже'
      });
      app.append(errorText);
      return;
    }
  
    categoryObj.mount(categories);
  };

  // Вызываем функцию отображения списка категорий
  renderIndex();

  // Обработчик события клика по списку категорий
  headerObj.headerLogoLink.addEventListener('click', renderIndex);

  headerObj.headerBtn.addEventListener('click', () => {
    allSectionUnmount();
    headerObj.updateHeaderTitle('Новая категория');
    editCategoryObj.mount();
    editCategoryObj.btnSave.addEventListener('click', postHandler);
    editCategoryObj.btnSave.removeEventListener('click', patchHandler);
  });

  categoryObj.categoryList.addEventListener('click', async ({ target }) => {
    const categoryItem = target.closest('.category__item');

    if (target.closest('.category__edit')) {
      const dataCards = await fetchCards(categoryItem.dataset.id);
      allSectionUnmount();
      headerObj.updateHeaderTitle('Редактирование');
      editCategoryObj.mount(dataCards);
      editCategoryObj.btnSave.addEventListener('click', patchHandler);
      editCategoryObj.btnSave.removeEventListener('click', postHandler);
      return;
    }

    if (target.closest('.category__del')) {
      if (confirm('Вы уверены что хотите удалить категорию?')){
        const result = fetchDeleteCategory(categoryItem.dataset.id);

        if (result.error) {
          showAlert(result.error.message);
          return
        }

        showAlert('Категория удалена!');
        categoryItem.remove();
      }
      
      return;
    }

    if (categoryItem) {
      const dataCards = await fetchCards(categoryItem.dataset.id);
      allSectionUnmount();
      headerObj.updateHeaderTitle(dataCards.title);
      pairsObj.mount(dataCards);
    }
  });

  // Обработчик события клика по кнопке "Назад"
  pairsObj.buttonReturn.addEventListener('click', renderIndex);
};

initApp();