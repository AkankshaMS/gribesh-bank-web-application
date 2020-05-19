import React, { Component, Fragment } from 'react';
import axios from "axios";
import { PageHeader } from 'react-bootstrap';
const config = require('../config.json');


class Transaction extends Component {

  state = {
    newproduct: { 
      "bankname": "", 
      "id": "",
      "accountname":"",
      "accountnumber":"",
      "amount":"",
      "remarks":"",
      "senderacc":""
    },
    products: [],
    isauthenticate:"TRUE"
  }

  handleAddProduct = async (id, event) => {
    event.preventDefault();
    // add call to AWS API Gateway add product endpoint here
    try {
    //   const params = {
    //     "bankname": this.state.newproduct.bankname,
    //     "id":id,
    //     "accountname":this.state.newproduct.accountname,
    //     "accountnumber":this.state.newproduct.accountnumber,
    //     "amount":this.state.newproduct.amount,
    //     "remarks":this.state.newproduct.remarks
    //   };
    //this.setState({ this.props.senderacc: this.state.newproduct.senderacc });
    this.props.changeacc(this.state.newproduct.senderacc,this.state.newproduct.accountnumber,this.state.newproduct.amount);
    const param ={
				"sa":this.state.newproduct.senderacc
			};
      const resotp = await axios.post(`${config.api.getotpUrl}/generate/`,param);
      console.log(resotp)
      console.log("OTP Pin Generated")
      this.props.history.push('/otp');
    // const params = {
    //     "sa":this.state.newproduct.senderacc,
    //     "ra":this.state.newproduct.accountnumber,
    //     "amt":this.state.newproduct.amount,
    //   };
      
      //await axios.post(`${config.api.transactionUrl}/test/`, params);
      //this.setState({ products: [...this.state.products, this.state.newproduct] });
      //this.setState({ newproduct: { "senderacc":"","bankname": "", "accountname": "","accountnumber":"","amount":"","remarks":"" }});
      //window.confirm('Press OK to proceed transaction.');
    }catch (err) {
      console.log(`An error has occurred: ${err}`);
    }
  }

  onAddBankName = event => this.setState({ newproduct: { ...this.state.newproduct, "bankname": event.target.value } });
  onAddAccountName = event => this.setState({ newproduct: { ...this.state.newproduct, "accountname": event.target.value } });
  onAddAccountNumber=event => this.setState({ newproduct: { ...this.state.newproduct, "accountnumber": event.target.value } });
  onAddAmount=event => this.setState({ newproduct: { ...this.state.newproduct, "amount": event.target.value } });
  onAddRemarks=event => this.setState({ newproduct: { ...this.state.newproduct, "remarks": event.target.value } });
  onAddSenderAcc=event=> this.setState({newproduct:{ ...this.state.newproduct,"senderacc":event.target.value}})

  renderTransact(){
    return (
      <Fragment>
        <section className="section">
          <div className="container">
            <h1>Fund Transfer Page</h1>
            <p>Enter details for transaction.</p>
            <br />
            <p className="subtitle is-5">
                Bank Name <br/>
                Saving Account | XYZ <br/>
                Available Balance: ₹ 0000.00
            </p>
            <div className="columns">
              <div className="column is-one-third">
                <form onSubmit={event => this.handleAddProduct(1, event)}>
                  

                  <div className="control">
                      <input 
                        className="input is-medium"
                        type="text" 
                        placeholder="Enter Sender Account Number"
                        value={this.state.newproduct.senderacc}
                        onChange={this.onAddSenderAcc}
                      />
                    </div>
                    <br/>
                    <label className="subtitle is-5"><strong>Payee</strong></label>
                    <br/><br/>
                    <div className="">
                    <div className="control">
                    <p className="subtitle is-5">Bank Details</p>
                      <input 
                        className="input is-medium"
                        type="text" 
                        placeholder="Enter Bank Name"
                        value={this.state.newproduct.bankname}
                        onChange={this.onAddBankName}
                      />
                      </div>
                      
                    <div className="control">
                    <p className="subtitle is-5">Account Details</p>
                      <input 
                        className="input is-medium"
                        type="text" 
                        placeholder="Enter Account Name"
                        value={this.state.newproduct.accountname}
                        onChange={this.onAddAccountName}
                      />
                    </div>
                    <div className="control">
                      <input 
                        className="input is-medium"
                        type="text" 
                        placeholder="Enter Account Number"
                        value={this.state.newproduct.accountnumber}
                        onChange={this.onAddAccountNumber}
                      />
                    </div>
                    <div className="control">
                    <p className="subtitle is-5">Transfer Details</p>
                      <input 
                        className="input is-medium"
                        type="text" 
                        placeholder="Enter Amount"
                        value={this.state.newproduct.amount}
                        onChange={this.onAddAmount}
                      />
                    </div>
                    <div className="control">
                      <input 
                        className="input is-medium"
                        type="text" 
                        placeholder="Remarks"
                        value={this.state.newproduct.remarks}
                        onChange={this.onAddRemarks}
                      />
                    </div>
                    <p className="subtitle is-5"></p>
                    <div className="control">
                      <button type="submit" className="button is-primary is-medium">
                        Fund Transfer
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </Fragment>
      )
  }

  renderErr(){
    return(
      <div className="test">
     <PageHeader align="center">You are not authorised to view this page. </PageHeader>
      <div class="lander">
      <p>Please Login.</p>
      <a href="/login" className="button is-primary">
                <strong>Login</strong>
              </a>
      </div>
    </div>
    )
  }

  render() {
    return( 
    <div className="Home">{this.props.isAuthenticated ? this.renderTransact() : this.renderErr()}
    </div>);
  }
}
export default Transaction;