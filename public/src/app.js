document.addEventListener('DOMContentLoaded', () => {
  const db = new PouchDB('productos_db'); 

  const productForm = document.getElementById('product-form');
  const productList = document.getElementById('product-list');

  const hiddenId = document.createElement('input');
  hiddenId.type = 'hidden';
  hiddenId.id = 'product-id';
  productForm.appendChild(hiddenId);

  const renderProducts = async () => {
    productList.innerHTML = '';
    try {
      const result = await db.allDocs({ include_docs: true, descending: true });
      result.rows.forEach((row) => {
        const { _id, _rev, name, description, price, quantity } = row.doc;
  
        const li = document.createElement('li');
        li.innerHTML = `
          <div>
            <strong>${name}</strong> - ${description} | 
            Precio: $${price} | Cantidad: ${quantity}
          </div>
          <div>
            <button class="edit-btn" onclick="editProduct('${_id}', '${_rev}', '${name}', '${description}', '${price}', '${quantity}')">Editar</button>
            <button onclick="deleteProduct('${_id}', '${_rev}')">Eliminar</button>
          </div>
        `;
        productList.appendChild(li);
      });
    } catch (error) {
      console.error('Error al recuperar productos:', error);
    }
  };
  

  productForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('product-id').value; 
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const quantity = document.getElementById('quantity').value;

    try {
      if (id) {
        const product = await db.get(id);
        await db.put({
          _id: id,
          _rev: product._rev,
          name,
          description,
          price,
          quantity
        });
        console.log('Producto actualizado:', name);
      } else {
        const newProduct = { _id: new Date().toISOString(), name, description, price, quantity };
        await db.put(newProduct);
        console.log('Producto agregado:', name);
      }

      productForm.reset();
      document.getElementById('product-id').value = ''; 
      renderProducts();
    } catch (error) {
      console.error('Error al agregar/actualizar producto:', error);
    }
  });

  window.deleteProduct = async (id, rev) => {
    try {
      await db.remove(id, rev);
      console.log('Producto eliminado:', id);
      renderProducts();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  window.editProduct = (id, rev, name, description, price, quantity) => {
    document.getElementById('product-id').value = id; 
    document.getElementById('name').value = name;
    document.getElementById('description').value = description;
    document.getElementById('price').value = price;
    document.getElementById('quantity').value = quantity;

    console.log('Editando producto:', id);
  };

  renderProducts();
});