let app = new Vue({
    el: '#app',
    data: { 
        sitename: 'After School Activities',
        activities: [],
        order: {
            fullName: '',
            email: '',
            telephone: '',
            country: '',
            city: '',
            address: ''
        },
        cart: [],
        searchQuery: '',
        sortOption: 'default',
        showCheckout: false
    },
    created() {
        // Fetch activities from the backend
        // Replace this URL with your actual API endpoint
        fetch('https://mdxbackshop-cle9.onrender.com/collection/lessons')
            .then(response => response.json())
            .then(json => {
                this.activities = json;
            })
            .catch(err => {
                console.error('Error fetching activities:', err);
            });
    },
    methods: {
        addToCart(activity) {
            if (this.canAddToCart(activity)) {
                this.cart.push(activity.id);
            }
        },
        canAddToCart(activity) {
            return activity.availableInventory > this.cartCount(activity.id);
        },
        cartCount(id) {
            return this.cart.filter(itemId => itemId === id).length;
        },
        toggleCheckout() {
            this.showCheckout = !this.showCheckout;
        },
        submitOrder() {
            const newOrder = {
                ...this.order,
                cart: this.cart
            };
            
            fetch('https://mdxbackshop-cle9.onrender.com/collection/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newOrder)
            })
            .then(response => response.json())
            .then(json => {
                alert('Order submitted!');
                this.cart = [];
                this.showCheckout = false;
            })
            .catch(error => {
                console.error('Error submitting order:', error);
                alert('Failed to submit order');
            });
        },
        filteredActivities() {
            let filtered = this.activities;

            if (this.searchQuery) {
                filtered = filtered.filter(activity =>
                    activity.title.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            }

            if (this.sortOption === 'price-asc') {
                filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            } else if (this.sortOption === 'price-desc') {
                filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
            } else if (this.sortOption === 'a-z') {
                filtered.sort((a, b) => a.title.localeCompare(b.title));
            } else if (this.sortOption === 'z-a') {
                filtered.sort((a, b) => b.title.localeCompare(a.title));
            }

            return filtered;
        }
    },
    computed: {
        cartItemCount() {
            return this.cart.length;
        },
        isOrderValid() {
            return this.order.fullName && 
                   this.order.email && 
                   this.order.telephone && 
                   this.order.country && 
                   this.order.city && 
                   this.order.address && 
                   this.cart.length > 0;
        }
    }
});

