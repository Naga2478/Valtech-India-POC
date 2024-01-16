const mockDataLayer = () => {
    if(typeof window !== 'undefined'){
    if (process.env.NODE_ENV !== 'production' && !window.dataLayer) {
      window.dataLayer = [];
    }}
  };
  
  export const pushEvent = (eventData) => {
  
    // set defaults where applicable
    const {
      event = 'uaevent',
    } = eventData;
  
    // only push defined values to the data layer
    let dataLayerData = Object.assign({},
      event === null ? null : { event },
    );
  
    mockDataLayer();
    if(typeof window !== 'undefined'){
    //Verification of full URL
    if ((typeof dataLayerData.link_url === 'string')&&(dataLayerData.link_url[0] === '/')) 
    {
      dataLayerData.link_url = `${window.location.origin}${dataLayerData.link_url}`
    }
    window.dataLayer && window.dataLayer.push(dataLayerData);
}
  };
  
  export const pushData = (data) => {
    mockDataLayer();
    if(typeof window !== 'undefined'){
    if (window.dataLayer && typeof data === 'object' && data !== null) {
      if ((typeof data.link_url === 'string')&&(data.link_url[0] === '/')) 
      {
        data.link_url = `${window.location.origin}${data.link_url}`
      }
      window.dataLayer.push(data);
    }}
  };
  
  export const resetDataLayer = () => {
    if(typeof window !== 'undefined'){
      window.dataLayer = [];
    }
  }