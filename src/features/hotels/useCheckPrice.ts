import type { MouseEvent } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import type { RootState } from "../../store";
import { rememberReturnPath, toReturnPath } from "../../routes/returnPath";
import { refreshBookLink, withVisitor } from "./visitor";

const SIGN_IN_PATH = "/create-account";
const SIGN_IN_TOAST_ID = "hotels-check-price-sign-in";

/**
 * "Check price" props for a hotel's booking link. Signed in: the partner's
 * booking page (with the visitor id). Signed out: sign up or log in first, then
 * back to this page (the same return path the rest of the site uses).
 */
export const useCheckPrice = () => {
  const signedIn = useSelector((state: RootState) => Boolean(state.auth?.accessToken));
  const navigate = useNavigate();
  const location = useLocation();

  return (bookUrl: string) => {
    if (signedIn) return { href: withVisitor(bookUrl), onClick: refreshBookLink(bookUrl) };
    const from = toReturnPath(location);
    return {
      // A real address, so opening it in a new tab also leads to sign-in
      href: SIGN_IN_PATH,
      onClick: (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        rememberReturnPath(from);
        toast("Sign in or create a free account to see live prices and book.", { id: SIGN_IN_TOAST_ID });
        navigate(SIGN_IN_PATH, { state: { from } });
      },
    };
  };
};
