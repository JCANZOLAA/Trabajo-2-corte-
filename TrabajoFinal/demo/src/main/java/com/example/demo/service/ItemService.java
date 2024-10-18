
    import java.util.ArrayList;
    import java.util.List;
    import java.util.Optional;
    import java.util.UUID;

    import org.springframework.stereotype.Service;

    import com.example.demo.entity.ProductEntity;

    @Service
    public class ItemService {
        private final List<ProductEntity> products;

        public ItemService() {
            this.products = new ArrayList<>();
            // Initialize with sample products
            products.add(new ProductEntity("Telefono", "Smartfone", 1.790.000, 50));
            products.add(new ProductEntity("Mesa", "Muebles", 175.000, 20));
            products.add(new ProductEntity("Adaptador TIPO C", "Tecnología", 25.000, 15));
        }

        public List<ProductEntity> getAllItems() {
            return new ArrayList<>(products);
        }

        public Optional<ProductEntity> getItemById(UUID id) {
            return products.stream()
                    .filter(product -> product.getId().equals(id))
                    .findFirst();
        }

        public ProductEntity createItem(ProductEntity product) {
            products.add(product);
            return product;
        }

        public Optional<ProductEntity> updateItem(UUID id, ProductEntity updatedProduct) {
            for (int i = 0; i < products.size(); i++) {
                if (products.get(i).getId().equals(id)) {
                    updatedProduct.setId(id);
                    products.set(i, updatedProduct);
                    return Optional.of(updatedProduct);
                }
            }
            return Optional.empty();
        }

        public boolean deleteItem(UUID id) {
            return products.removeIf(product -> product.getId().equals(id));
        }
    }
