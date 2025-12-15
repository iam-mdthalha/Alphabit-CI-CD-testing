import { Category } from "Types/Category";
import { Link, useNavigate } from "react-router-dom";
import classes from "./CategoryNavbar.module.css";

type Props = {
  categories: Array<Category>;
};

const CategoryNavbar = ({ categories }: Props) => {
  const params = {
    name: "page",
    value: 1,
  };

  // const { userInfo } = useSelector((state: RootState) => state.login);
  const navigate = useNavigate();

  return (
    <div className={classes.navDropdownContainer}>
      {/* <SideNavbar opened={opened} close={close}
                title={
                    userInfo ? 
                    <div style={{display: 'flex'}}>
                        <Title c={'var(--mantine-color-dark)'} ta={'center'} order={5}>Hello, {userInfo.fullName}</Title>
                    </div>
                    :
                    <div style={{display: 'flex'}}>
                        <Title c={'var(--mantine-color-dark)'} ta={'center'} order={5}>Hello, </Title>
                        <Button size="compact-sm" variant='subtle' onClick={() =>  {
                            navigate('/login'); 
                            close();
                            }}>Sign In</Button>
                    </div>
                }
            >
                
            </SideNavbar> */}
      <div className="w-full flex items-center justify-center list-none px-4">
        <div className="flex gap-x-12">
          <Link style={{ textDecoration: "none" }} to={`/top-sellers?page=1`}>
            <div className='h-full font-semibold relative w-fit block after:block after:content-[""] after:absolute after:h-[3px] after:bg-secondary-800 after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center'>
              TOP SELLERS
            </div>
          </Link>
          {categories.map((category, i) => {
            return (
              <Link
              key={i}
                style={{ textDecoration: "none" }}
                to={`/shop/${category.categoryCode}?page=1`}
              >
                <div className='h-full font-semibold relative w-fit block after:block after:content-[""] after:absolute after:h-[3px] after:bg-secondary-800 after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center'>
                  {category.categoryName.toUpperCase()}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryNavbar;
