import React, { Component, Fragment } from 'react';
import  {API } from 'aws-amplify';

export default class MyAccount extends Component {

  state = {
    newproduct: { 
            "accnum":""
          },
    products: []
  }

  fetchProducts = async (accnum, event) => {
    // add call to AWS API Gateway to fetch products here
    // then set them in state
   event.preventDefault();
    try {
    //   const params={
    //   "AccountNumber":accnum
    // };
      //console.log("This is account number: " + AccountNumber);
      //const products= await API.get('testApiCall', '/test/123');
      let path='/'+accnum;
      const products=await API.get('testApiCall', path);
      //console.log(products);
      //const idrespo=await Auth.currentSession()
      //console.log(idrespo)
      //var idresp=idrespo.idToken.jwtToken
      //console.log(idresp);
      //const res = await axios.get(`${config.api.transactionUrl}/test/${accnum}`,{ headers: { Authorization: idresp } });
      //const products = res.data;
      console.log(products);
      this.setState({ products });
      console.log(this.state.products);
     
    } catch (err) {
      console.log(`An error has occurred: ${err}`);
    }
  }

  // componentDidMount = () => {
  //   this.fetchProducts();
  // }
  onAddAccountNumberChange = event => this.setState({ newproduct: { ...this.state.newproduct, "accnum": event.target.value } });
  render() {
    return (
      <Fragment>
        <section className="section">
          <div className="container">
            <h1>Account Details</h1>
            <br />
            <div className="columns">
              <div className="column">
                <div className="tile is-ancestor">
                  <div className="tile is-4 is-parent  is-vertical">
                    {/* { 
                      this.state.products && this.state.products.length > 0
                      ? this.state.products.map(product => <Product name={product.AccountName} id={product.AccountNumber} key={product.Amount} />)
                      : <div className="tile notification is-warning">No products available</div>
                    } */}
                     <form onSubmit={event => this.fetchProducts(this.state.newproduct.accnum,event)}>
                     <div className="control">
                       <input 
                        className="input is-medium"  
                        type="text" 
                        placeholder="Enter Account Number"
                        value={this.state.newproduct.accnum}
                       onChange={this.onAddAccountNumberChange}
                      />
                    </div>
                    <button type="submit" className="button is-primary is-medium">
                     Get Details
                       </button>
                     </form>
                    {
                      <div className="tile notification is-warning">
                        Account Number: {this.state.products.AccountNumber} <br/>
                        Account Name : {this.state.products.AccountName} <br/>
                        Account Balance : {this.state.products.Amount}
                        </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Fragment>
    )
  }
}
