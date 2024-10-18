document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');
    const productTableBody = document.getElementById('productTableBody');

    // Load products on page load
    loadProducts();

    // Handle form submission
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const product = {
            name: document.getElementById('name').value.trim(),
            category: document.getElementById('category').value.trim(),
            price: parseFloat(document.getElementById('price').value),
            stock: parseInt(document.getElementById('stock').value)
        };
        const productId = document.getElementById('productId').value;

        if (isNaN(product.price) || product.price < 0) {
            alert('Por favor, ingresa un precio válido.');
            return;
        }

        if (isNaN(product.stock) || product.stock < 0) {
            alert('Por favor, ingresa un stock válido.');
            return;
        }

        if (productId) {
            await updateProduct(productId, product);
        } else {
            await createProduct(product);
        }
    });

    // Load all products
    async function loadProducts() {
        try {
            const response = await fetch('/products');
            const products = await response.json();
            productTableBody.innerHTML = '';
            products.forEach(product => {
                const row = createProductRow(product);
                productTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error loading products:', error);
            alert('Error al cargar los productos. Inténtalo de nuevo más tarde.');
        }
    }

    // Create a new product
    async function createProduct(product) {
        try {
            const response = await fetch('/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });

            if (!response.ok) throw new Error('Error creando el producto.');

            await loadProducts();
            productForm.reset();
        } catch (error) {
            console.error('Error creating product:', error);
            alert('Error al crear el producto. Inténtalo de nuevo.');
        }
    }

    // Update an existing product
    async function updateProduct(id, product) {
        try {
            const response = await fetch(`/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });

            if (!response.ok) throw new Error('Error actualizando el producto.');

            await loadProducts();
            productForm.reset();
            document.getElementById('productId').value = '';
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Error al actualizar el producto. Inténtalo de nuevo.');
        }
    }

    // Delete a product
    async function deleteProduct(id) {
        try {
            const response = await fetch(`/products/${id}`, { method: 'DELETE' });

            if (!response.ok) throw new Error('Error eliminando el producto.');

            await loadProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Error al eliminar el producto. Inténtalo de nuevo.');
        }
    }

    // Create a table row for a product
    function createProductRow(product) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.stock}</td>
            <td>
                <button class="btn btn-sm btn-success edit-btn">
                    <i class="fa fa-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger delete-btn">
                    <i class="fa fa-times"></i>
                </button>
            </td>
        `;

        // Add event listeners for edit and delete buttons
        row.querySelector('.edit-btn').addEventListener('click', () => {
            document.getElementById('productId').value = product.id;
            document.getElementById('name').value = product.name;
            document.getElementById('category').value = product.category;
            document.getElementById('price').value = product.price;
            document.getElementById('stock').value = product.stock;
        });

        row.querySelector('.delete-btn').addEventListener('click', () => {
            if (confirm('Está seguro de eliminar este producto?')) {
                deleteProduct(product.id);
            }
        });

        return row;
    }
});
