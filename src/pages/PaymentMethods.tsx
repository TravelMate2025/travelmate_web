
import { useState, useEffect } from "react";
import { Checkbox, Divider, FormControlLabel, Modal, Paper, TextField } from "@mui/material";
import master from "../assets/master.svg";
import visa from "../assets/visa.svg";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { ToastContainer, toast } from 'react-toastify';
import "../style/Paymethod.css"

interface Card {
  name: string;
  cardNumber: string;
  image: string;
}

interface FormErrors {
  cardNumber: boolean;
  cardHolder: boolean;
  expiryDate: boolean;
  cvv: boolean;
}

const PaymentMethods = () => {
  const [defaultCardIndex, setDefaultCardIndex] = useState<number | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openDefault, setOpenDefault] = useState<boolean>(false);
  // const [openAddCard, setOpenAddCard] = useState<boolean>(false);
  const [cardToDeleteIndex, setCardToDeleteIndex] = useState<number | null>(null); 
  // const [cards, setCards] = useState([
  //   {
  //     name: "Elvis Igiebor",
  //     cardNumber: "..... ..... ..... ............ 4444",
  //     image: master,
  //   },
  //   {
  //     name: "Elvis Igiebor",
  //     cardNumber: "..... ..... ..... ............ 4444",
  //     image: master,
  //   },
  //   {
  //     name: "Elvis Igiebor",
  //     cardNumber: "..... ..... ..... ............ 4444",
  //     image: master,
  //   }
  // ]);

  const handleDeleteClick = (index: number) => {
    setCardToDeleteIndex(index); 
    setOpenModal(true);
  };


  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSetAsDefault = () => {
    if (currentCardIndex !== null) {
      setDefaultCardIndex(currentCardIndex);
      setOpenDefault(false);
      toast.success("Card Set as Default Successfully");
    }
  };

  const handleOpenDefault = () => {
    setOpenDefault(false);
  };

 const handleOpenAddCard = () => {
    setOpenAddCard(false);
  };

    const [touched, setTouched] = useState<FormErrors>({
  cardNumber: false,
  cardHolder: false,
  expiryDate: false,
  cvv: false,
});

const [errors, setErrors] = useState<FormErrors>({
  cardNumber: false,
  cardHolder: false,
  expiryDate: false,
  cvv: false,
});
     
     
     const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
       const { name } = e.target;
       setTouched((prev) => ({ ...prev, [name]: true }));
     };
     
  const [cards, setCards] = useState<Card[]>([]);
const [formData, setFormData] = useState({
  cardNumber: '',
  cardHolder: '',
  expiryDate: '',
  cvv: '',
});

const [openAddCard, setOpenAddCard] = useState(false);


  const handleChangePayment = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
  setTouched((prev) => ({ ...prev, [name]: true }));
};


     
     const [isFormValid, setIsFormValid] = useState(false);
     
     
useEffect(() => {
  const newErrors = {
    cardNumber: formData.cardNumber.length !== 16,
    cardHolder: formData.cardHolder.trim() === "",
    expiryDate: formData.expiryDate === "",
    cvv: formData.cvv.length !== 3,
  };

  setErrors(newErrors);
  setIsFormValid(!Object.values(newErrors).includes(true));
}, [formData]);


  useEffect(() => {
    if (cards.length > 0) {
      localStorage.setItem("cards", JSON.stringify(cards));
    }
  }, [cards]);

useEffect(() => {
  const storedCards = localStorage.getItem("cards");
  if (storedCards) {
    setCards(JSON.parse(storedCards));
  }
}, []);


   const formatCardNumber = (num: string | number) => {
    return num.toString().replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatCardNumberForDisplay = (cardNumber: string) => {
  // Mask all but the last 4 digits
  const masked = cardNumber.slice(0, -4).replace(/\d/g, '*'); // Mask all but last 4 digits
  const lastFour = cardNumber.slice(-4); // Get the last 4 digits
  return masked + lastFour; // Combine masked part with the last 4 digits
};



 const handleSaveClick = () => {
    const newCard = {
      name: formData.cardHolder,
      cardNumber: formatCardNumber(formData.cardNumber),
      image: master,
    };

    setCards((prev) => [...prev, newCard]);

    toast.success("Card Added Successfully");

    setOpenModal(false);
    setFormData({
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      cvv: '',
    });
    setTouched({
      cardNumber: false,
      cardHolder: false,
      expiryDate: false,
      cvv: false,
    });

    handleOpenAddCard()
  };



const handleDeleteCard = () => {
  if (cardToDeleteIndex !== null) {
    const updatedCards = cards.filter((_, index) => index !== cardToDeleteIndex);
    setCards(updatedCards);

    // Save the updated cards array to localStorage after deletion
    localStorage.setItem("cards", JSON.stringify(updatedCards));

    toast.success("Card Deleted Successfully");
  }
  setOpenModal(false);
};

 


  return (
    <div className="">
      <ToastContainer />
      <div className="flex gap-2 justify-between">
        <div className="flex gap-1">
          <img src={master} alt="" className="w-[48px] h-[36px]" />
          <img src={visa} alt="" className="w-[48px] h-[36px]" />
        </div>

        <div className="h-[50px] p-6 text-center pt-3 border-1 bg-white border-[#023E8A] rounded-[8px] cursor-pointer">
          <button onClick={() => {setOpenAddCard(true)}} className="text-[#023E8A] cursor-pointer">
            <AddOutlinedIcon /> Add New Card
          </button>
        </div>
      </div>

      <div className=" h-[30rem] overflow-y-auto custom-scroll">

      <div className="mt-[24px]">
        {cards.map((card, index) => (
          <div
            key={index}
            className="border-1 border-[#CDCED1] bg-white w-full rounded-[12px] pt-[16px] pr-[24px] pl-[24px] mb-4"
          >
            <div className="flex justify-between mb-[20px]">
              <div className="flex gap-2">
                <img src={card.image} alt="" className="w-[48px] h-[36px]" />
                <div>
                  <div className="flex gap-4">
                    <p>{card.name}</p>
                    {defaultCardIndex === index && (
                      <div>
                        <button className="border-1 border-[#FF6F1E] bg-[#FFE2D2] w-[55px] h-[25px] rounded-[4px] text-[#181818] text-[12px]">
                          Default
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-[14px] text-[#67696D] mt-1">{formatCardNumberForDisplay(card.cardNumber)}</p>
                </div>
              </div>

              <div
                className="text-[#D72638] h-[24px] cursor-pointer mt-3"
                onClick={() => handleDeleteClick(index)}
              >
                <DeleteOutlineOutlinedIcon />
              </div>
            </div>

            {defaultCardIndex !== index && (
              <div
                onClick={() => {
                  setCurrentCardIndex(index);
                  setOpenDefault(true);
                }}
                className="cursor-pointer"
              >
                <Divider />
                <p className="text-[13px] text-[#023E8A] mt-[10px] cursor-pointer font-medium mb-[10px] ">
                  Set as default
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      </div>

       <Modal
        open={openAddCard}
        onClose={handleOpenAddCard}
        BackdropProps={{
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          },
        }}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper className="p-4 border-[#CDCED1] rounded-[12px] relative  h-[580px] w-[503px] overflow-y-auto custom-scroll ">
          <div
            onClick={handleOpenAddCard}
            style={{display:"flex", justifyContent:"flex-end"}}
          >
            <div className="w-[32px] rounded-[4px] bg-white shadow text-center cursor-pointer">
              <CloseIcon />
            </div>
          </div>
          <p className="font-medium text-center text-[20px] mt-[-24px] text-[#181818] mb-2">Add New Card</p>
          <Divider/>



            <div className=" mt-[10px] ">
                            
                                        <div className="flex flex-col mb-[10px]">
                                            <label className="mb-[12px] text-[#181818] font-medium text-[16px]">Card Number</label>
                                            <TextField
                                            name="cardNumber"
                                            type="number"
                                            variant="outlined"
                                            size="small"
                                            placeholder="1234 5678 9876 0192"
                                            value={formData.cardNumber}
                                            onChange={handleChangePayment}
                                            onBlur={handleBlur}
                                            error={errors.cardNumber && touched.cardNumber}
                                             helperText={errors.cardNumber && touched.cardNumber ? "Card number must be 16 digits" : ""}
                                             sx={{
                                                width: "100%",
                                                "& .MuiOutlinedInput-root": {
                                                height: "44px",
                                                borderRadius: "8px",
                                                borderColor: touched.cardNumber ? (errors.cardNumber ? "red" : "#818489") : "#818489",
                                                },
                                            }}
                                            />
                                        </div>
                
                                        <div className="flex flex-col mb-[10px]">
                                            <label className="mb-[12px] text-[#181818] font-medium text-[16px]">Cardholder's Name</label>
                                            <TextField
                                            name="cardHolder"
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            placeholder="Enter Name"
                                            value={formData.cardHolder}
                                            onChange={handleChangePayment}
                                            error={errors.cardHolder && touched.cardHolder}
                                            helperText={errors.cardHolder && touched.cardHolder ? "Cardholder's name is required" : ""}
                                                sx={{
                                                width: "100%",
                                                "& .MuiOutlinedInput-root": {
                                                height: "44px",
                                                borderRadius: "8px",
                                                borderColor: touched.cardHolder ? (errors.cardHolder ? "red" : "#818489") : "#818489",
                                                },
                                            }}
                                            />
                                        </div>
                
                                        <div className="flex flex-col mb-[10px]">
                                            <label className="mb-[12px] text-[#181818] font-medium text-[16px]">Expiry Date</label>
                                            <TextField
                                            name="expiryDate"
                                              type="month"
                                            variant="outlined"
                                            size="small"
                                            value={formData.expiryDate}
                                            onChange={handleChangePayment}
                                            error={errors.expiryDate && touched.expiryDate}
                                            helperText={errors.expiryDate && touched.expiryDate ? "Expiry date is required" : ""}
                                                sx={{
                                                width: "100%",
                                                "& .MuiOutlinedInput-root": {
                                                height: "44px",
                                                borderRadius: "8px",
                                                borderColor: touched.expiryDate ? (errors.expiryDate ? "red" : "#818489") : "#818489",
                                                },
                                            }}
                                            />
                                        </div>
                
                                        <div className="flex flex-col mb-[10px]">
                                            <label className="mb-[12px] text-[#181818] font-medium text-[16px]">CVV</label>
                                            <TextField
                                            name="cvv"
                                            type="number"
                                            variant="outlined"
                                            size="small"
                                            placeholder="123"
                                            value={formData.cvv}
                                            onChange={handleChangePayment}
                                            error={errors.cvv && touched.cvv}
                                            helperText={errors.cvv && touched.cvv ? "CVV must be 3 digits" : ""}
                                                sx={{
                                                width: "100%",
                                                "& .MuiOutlinedInput-root": {
                                                height: "44px",
                                                borderRadius: "8px",
                                                borderColor: touched.cvv ? (errors.cvv ? "red" : "#818489") : "#818489",
                                                },
                                            }}
                                            />
                                        </div>
                
                                        <FormControlLabel control={<Checkbox />} label="Save this card for future payment" className='mt-[-10px]'  />
            </div>

<Divider sx={{marginTop:"30px", marginBottom:"30px"}} />

          <div className="flex gap-4 justify-end ">
            <button
              onClick={handleOpenAddCard}
              className="border-1 border-[#023E8A] w-[99px] text-[#023E8A] bg-white p-2 rounded-[8px] h-[50px] cursor-pointer text-[20px] font-medium"
            >
              Cancel
            </button>
            <div className="w-[79px]" >
                  <Divider />
<button
  onClick={handleSaveClick}
  disabled={!isFormValid}
  className={`p-2 w-[100%] rounded-[8px] h-[50px] cursor-pointer text-[20px] font-medium ${
    isFormValid ? 'bg-[#023E8A] text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
  }`}
>
  Save
</button>


           
            </div>
          </div>
        </Paper>
      </Modal>

      <Modal
        open={openDefault}
        onClose={handleOpenDefault}
        BackdropProps={{
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          },
        }}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper className="p-4 border-[#CDCED1] rounded-[8px] relative  h-[349px] w-[468px]">
          <div
            onClick={handleOpenDefault}
            style={{display:"flex", justifyContent:"flex-end"}}
          >
            <div className="w-[32px] rounded-[4px] bg-white shadow text-center cursor-pointer">
              <CloseIcon />
            </div>
          </div>
          <p className="font-medium text-center text-[24px] mt-[24px] text-[#181818] mb-[24px]">Set As Default</p>

          <h3 className="text-[18px] w-[90%] m-auto font-normal text-center text-[#67696D]  mb-[58px]">Do you want to set this card as your default payment method? It will be used for all future transactions.</h3>
          <div className="flex gap-4 justify-between">
            <button
              onClick={handleOpenDefault}
              className="border-1 border-[#023E8A] w-[50%] text-[#023E8A] bg-white p-2 rounded-[8px] h-[56px] cursor-pointer text-[20px] font-medium"
            >
              Cancel
            </button>
            <div className="w-[50%]">
              {currentCardIndex !== null && (
                <div onClick={handleSetAsDefault} className=" ">
                  <Divider />
                  <button
                    className="bg-[#023E8A] text-white p-2 w-[100%] rounded-[8px]  h-[56px] cursor-pointer text-[20px] font-medium"
                  >
                    Set As Default
                  </button>
                </div>
              )}
            </div>
          </div>
        </Paper>
      </Modal>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        BackdropProps={{
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          },
        }}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper className="p-4 border-1 border-[#CDCED1] rounded-[8px] relative  h-[349px] w-[468px]">
          <div
            onClick={handleCloseModal}
            style={{display:"flex", justifyContent:"flex-end"}}
          >
            <div className="w-[32px] rounded-[4px] bg-white shadow text-center cursor-pointer">
              <CloseIcon />
            </div>
          </div>
          <p className="font-medium text-center text-[24px] mt-[24px] text-[#181818] mb-[24px]">Delete Card</p>

          <h3 className="text-[18px] w-[90%] m-auto font-normal text-center text-[#67696D]  mb-[80px]">Are you sure you want to delete this card? This action cannot be undone.</h3>
          <div className="flex gap-4 justify-between">
            <button
              onClick={handleCloseModal}
              className="border-1 border-[#023E8A] text-[#023E8A] bg-white p-2 rounded-[8px] w-[50%] h-[56px] cursor-pointer text-[20px] font-medium"
            >
              Cancel
            </button>

            <button
              onClick={handleDeleteCard}
              className="bg-[#D72638] text-white p-2 rounded-[8px] w-[50%] h-[56px] cursor-pointer text-[20px] font-medium"
            >
              Delete Card
            </button>
          </div>
        </Paper>
      </Modal>
    </div>
  );
};

export default PaymentMethods;
