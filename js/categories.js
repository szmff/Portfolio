/* Static portfolio categories — no database connection. */
async function getCategories() {
    return [
        { id: 'web', name: 'Web Development', slug: 'web-development', description: '', sort_order: 1, is_active: true },
        { id: 'commerce', name: 'E-commerce', slug: 'e-commerce', description: '', sort_order: 2, is_active: true },
        { id: 'other', name: 'Other Projects', slug: 'other', description: '', sort_order: 3, is_active: true }
    ];
}
