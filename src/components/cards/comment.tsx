import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Small, P, H4 } from "../ui/typography";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faStar } from "@fortawesome/free-solid-svg-icons";
import { faHeart, faStar as faStarOutline } from "@fortawesome/free-regular-svg-icons";
import { Button } from "../ui/button";

type Props = {

}

export default function CommentCard() {
  
  return (
    <Card className="relative mb-4">
      <FontAwesomeIcon icon={faEllipsis} width={12} height={12} className="ml-auto absolute right-4 top-4" />
      <CardContent className="pt-6">
        <div className="flex flex-row">
          <div className="flex flex-col">
            <Avatar className="ml-1">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col mr-3 text-center">
              <Button variant={"ghost"}>
                <FontAwesomeIcon icon={faHeart} width={14} height={14}/>
              </Button>
              <Small>38</Small>
            </div>
            
          </div>
          
          <div>
            <div className="flex flex-row">
              <Small>Myster User</Small>
              <div className="flex flex-row ml-2 my-auto">
                <FontAwesomeIcon icon={faStar} width={12} height={16} />
                <FontAwesomeIcon icon={faStar} width={12} height={16} />
                <FontAwesomeIcon icon={faStar} width={12} height={16} />
                <FontAwesomeIcon icon={faStar} width={12} height={16} />
                <FontAwesomeIcon icon={faStarOutline} width={12} height={16} />
              </div>
            </div>

            <div>
              <P classNames="text-muted-foreground">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</P>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}