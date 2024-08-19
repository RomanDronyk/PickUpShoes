// Checkout component
export default function Thanks() {
    const styleS = {
        backgroudColor: "rgba(255, 255, 255, 0)",
        borderRadius: "16px",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(9.6px)",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        position: "absolute"
    }

    return (
        <div className="flex flex-col contaier  md:grid  lg:grid-cols-[1fr_1fr]  w-full "
            style={{ height: "90vh", maxWidth: "100%", overflow: "hidden" }}
            >
            <div className=' leading-7 lg:leading-10 -scale-x-[1] bg-cover relative flex items-center justify-center w-full bg-no-repeat  bg-center bg-contain   bg-blend-screen h-full bg-thankBg'>
                <div style={styleS} >
                </div>
                <div className=' -scale-x-[1]  lg:items-start items-center' style={{display: "flex", flexDirection: "column",   padding: "10vh 0", zIndex: 23, color: "#fff", margin: "auto auto" }}>
                    <h1  className='px-6 mb-[46px] text-[24px] lg:text-[36px]'>Дякуєм! Ваше замовлення  було успішно прийняте.</h1>
                    <p className='px-6 items-center flex gap-[20px]  text-[22px] lg:text-[36px] mb-[62px] lg:mb-[10vh]'>
                        <span >
                        <svg className='w-[52px] h-[52px] lg:h-[67px] lg:w-[67px]' width="67" height="67" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M33.7496 13.5959C33.7496 12.6258 33.7496 12.1368 33.9726 11.7378C34.1744 11.3941 34.4797 11.123 34.8449 10.9633C35.2674 10.7912 35.6977 10.846 36.5583 10.9477C40.4115 11.4127 44.0892 12.826 47.2621 15.0611C50.4351 17.2961 53.0043 20.2832 54.7397 23.7547C56.4751 27.2263 57.3225 31.074 57.206 34.9534C57.0896 38.8328 56.0129 42.6227 54.0724 45.984C52.132 49.3452 49.3882 52.1727 46.0869 54.2134C42.7856 56.2541 39.0297 57.4443 35.1556 57.6774C31.2814 57.9105 27.4099 57.1792 23.8878 55.549C20.3656 53.9188 17.3026 51.4406 14.9732 48.3363C14.4529 47.64 14.1908 47.2919 14.1321 46.842C14.0871 46.4448 14.1693 46.0435 14.3668 45.6959C14.6015 45.3047 15.0201 45.0622 15.8611 44.5771L32.3414 35.0637C32.8538 34.7664 33.112 34.6178 33.2959 34.4104C33.4614 34.2273 33.5867 34.0114 33.6636 33.7767C33.7496 33.5146 33.7496 33.2173 33.7496 32.6228V13.5959Z" fill="white" />
                            <path d="M33.75 67.5C52.1135 67.5 67 52.6135 67 34.25C67 15.8865 52.1135 1 33.75 1C15.3865 1 0.5 15.8865 0.5 34.25C0.5 52.6135 15.3865 67.5 33.75 67.5Z" stroke="white" />
                        </svg>
                    </span > Очікуйте на зв’язок із нашим менеджером 
                    </p>
                    <span  className="lg:ml-6 lg:text-[26px] text-black rounded-[40px] bg-[#fff] p-[20px_35px] text-nowrap  text-[18px]">Найкращі — обирають найкращих</span>
                </div>
            </div>
            <div className=' bg-cover flex items-center justify-center w-full bg-no-repeat  bg-center bg-contain bg-white/7 bg-blend-screen h-full bg-thankBg'>
            </div>
        </div>
    )
}
