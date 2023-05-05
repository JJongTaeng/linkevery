class Utils {
  isBottomScrollElement(element: HTMLElement) {
    return (
      element.scrollHeight - element.getBoundingClientRect().height <
      element.scrollTop + 200
    );
  }
}

export const utils = new Utils();
