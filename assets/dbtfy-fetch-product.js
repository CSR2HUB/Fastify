fetchProductMarkup = async function (settings, successCallback) {
  let { template, productHandles } = settings;

  if (!template || !productHandles) {
    return;
  }

  if (typeof productHandles === 'string') {
    productHandles = [productHandles];
  }

  const uniqueHandles = Array.from([...new Set(productHandles)]);

  const productMarkups = await Promise.all(
    uniqueHandles.map((handle) => {
      return fetch(`/products/${handle}?view=${template}`)
        .then((response) => response.text())
        .then((markup) => {
          return {
            handle,
            template: markup,
          };
        });
    })
  ).then((data) => {
    return data.reduce((products, response) => {
      return {
        ...products,
        [response.handle]: response.template,
      };
    }, {});
  });

  if (typeof successCallback === 'function') {
    successCallback(productMarkups);
  }

  return productMarkups;
};
