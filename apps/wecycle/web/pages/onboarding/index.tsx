import { Button, Input, Select, TextArea } from '@tanbel/react-ui';
import React, { useState } from 'react';

function Index() {
  const formArray = [1, 2, 3];
  const [formNo, setFormNo] = useState(formArray[0])
  const [state, setState] = useState({
    companyName: '',
    compnayType: '',
    numberOfEmployee: '',
    businessDocuments: '',
    payoutInformation: '',
    paymentMethod: '',
  })

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    })
    console.log(state);
  }


  const handleSelectChange = (field: string, value: string) => {
    setState({
      ...state,
      [field]: value
    })
  }
  const next = () => {
    if (formNo === 1 && state.companyName && state.compnayType && state.numberOfEmployee) {
      setFormNo(formNo + 1)
    }
    else if (formNo === 2 && state.businessDocuments) {
      setFormNo(formNo + 1)
    } else {
      // toast.error('Please fillup all input field')
    }
  }
  const pre = () => {
    setFormNo(formNo - 1)
  }
  const finalSubmit = async() => {
    console.log(state);
    
  }
  return (
    <div className="mt-12">
      <div className="card rounded-md shadow-md bg-white p-5">
        <div className='flex justify-center items-center mb-8'>
          {
            formArray.map((v, i) => <><Button className={`w-[45px] my-3 text-white rounded-full ${formNo - 1 === i || formNo - 1 === i + 1 || formNo === formArray.length ? '' : 'bg-slate-400'} h-[45px] flex justify-center items-center`}>
              {v}
            </Button>
              {
                i !== formArray.length - 1 && <div className={`w-[85px] h-[2px] ${formNo === i + 2 || formNo === formArray.length ? 'bg-green-400' : 'bg-slate-400'}`}></div>
              }
            </>)
          }
        </div>
        {
          formNo === 1 && <div className='flex flex-col flex-wrap gap-4'>
            <h1 className='text-center mb-2'>Company Information</h1>
            <div className='flex flex-col mb-2'>
              <label>Company name : </label>
              <Input value={state.companyName} name='companyName' placeholder='Enter the company name' onChange={inputHandle} />
            </div>
            <div className='flex flex-col mb-2'>
              <Select value={state.compnayType}
                label='Company type : '
                onChange={(value) => handleSelectChange('compnayType', value)} options={[{
                  label: "B2B",
                  value: "B2B"
                }, {
                  label: "B2C",
                  value: "B2C"
                }, {
                  label: "B2E",
                  value: "B2E"
                }]} />
            </div>
            <div className='flex flex-col mb-2'>
              <label>Number of employee : </label>
              <Input type='number' value={state.numberOfEmployee} name='numberOfEmployee' placeholder='Enter the number of employee' onChange={inputHandle} />
            </div>
            <div className='mt-4 flex justify-center items-center'>
              <Button onClick={next} className='px-3 py-2 text-lg rounded-md w-full text-white'>Next</Button>
            </div>
          </div>
        }

        {
          formNo === 2 && <div>
            <h1 className='text-center mb-2'>Business Documents </h1>
            <div className='flex flex-col mb-2'>
              <label>Business documents : </label>
              <TextArea value={state.businessDocuments} name='businessDocuments' placeholder='Enter the company name' onChange={inputHandle} />
            </div>
            <div className='mt-4 gap-3 flex justify-center items-center self-end'>
              <Button onClick={pre} className='px-3 py-2 text-lg rounded-md w-full flex text-white self-start'>Previous</Button>
              <Button onClick={next} className='px-3 py-2 text-lg rounded-md w-full text-white self-end'>Next</Button>
            </div>
          </div>
        }

        {
          formNo === 3 && <div>
            <h1 className='text-center mb-2'>Payout Information</h1>
            <div className='flex flex-col mb-2'>
              <label >Payout Information</label>
              <Input value={state.payoutInformation} onChange={inputHandle} name='payoutInformation' placeholder='Enter payout information' />
            </div>
            <div className='flex flex-col mb-2'>
              <Select value={state.paymentMethod}
                label='Payment method : '
                onChange={(value) => handleSelectChange('paymentMethod', value)} options={[{
                  label: "CASH ON DELIVERY",
                  value: "CASHONDELIVERY"
                }, {
                  label: "ONLINE",
                  value: "ONLINE"
                }]} />
            </div>
            <div className='mt-4 gap-3 flex justify-center items-center'>
              <Button onClick={pre} className='px-3 py-2 text-lg rounded-md w-full text-white'>Previous</Button>
              <Button onClick={finalSubmit} className='px-3 py-2 text-lg rounded-md w-full text-white'>Submit</Button>
            </div>
          </div>
        }

      </div>
    </div>
  );
}

export default Index;