const API_URL = 'https://smoggy-mountainous-mice.glitch.me';

// Функция для получения списка категорий с сервера
export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/api/category`);
    
    if (!(response.status === 200 || response.status === 201)) {
      const error = await response.json();
      throw error;
    }

    const categories = await response.json();
    return categories;

  } catch (error) {
    return { error };
  }
};

// Функция для получения карточек категории по ее ID
export const fetchCards = async id => {
  try {
    const response = await fetch(`${API_URL}/api/category/${id}`);
    
    if (!(response.status === 200 || response.status === 201)) {
      const error = await response.json();
      throw error;
    }

    const cards = await response.json();
    return cards;

  } catch (error) {
    return { error };
  }
};

// Функция для создания новой категории
export const fetchCreateCategory = async data => {
  try {
    const response = await fetch(`${API_URL}/api/category/`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    
    if (!(response.status === 200 || response.status === 201)) {
      const error = await response.json();
      throw error;
    }

    const categories = await response.json();
    return categories;

  } catch (error) {
    return { error };
  }
};

// Функция для редактирования категории
export const fetchEditCategory = async (id, data) => {
  try {
    const response = await fetch(`${API_URL}/api/category/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
    
    if (!(response.status === 200 || response.status === 201)) {
      const error = await response.json();
      throw error;
    }

    const categories = await response.json();
    return categories;

  } catch (error) {
    return { error };
  }
};

// Функция для удаления категории
export const fetchDeleteCategory = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/category/${id}`, {
      method: 'DELETE',
    });
    
    if (!(response.status === 200 || response.status === 201)) {
      const error = await response.json();
      throw error;
    }

    const result = await response.json();
    return result;

  } catch (error) {
    return { error };
  }
};