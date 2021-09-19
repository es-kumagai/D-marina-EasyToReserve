//
//  SafariExtensionHandler.swift
//  D-marina-EasyToReserve Extension
//
//  Created by Tomohiro Kumagai on 2021/09/18.
//

import SafariServices

class SafariExtensionHandler: SFSafariExtensionHandler {
    
    override func messageReceived(withName messageName: String, from page: SFSafariPage, userInfo: [String : Any]?) {
        // This method will be called when a content script provided by your extension calls safari.extension.dispatchMessage("message").
        page.getPropertiesWithCompletionHandler { properties in

        }
    }

    override func toolbarItemClicked(in window: SFSafariWindow) {

        requestAvailabilityOfAllReservations(in: window)
    }
    
    override func validateToolbarItem(in window: SFSafariWindow, validationHandler: @escaping ((Bool, String) -> Void)) {

        window.getActiveTab { tab in
            
            guard let tab = tab else {
                
                return validationHandler(false, "")
            }
            
            tab.getActivePage { page in
                
                guard let page = page else {
                    
                    return validationHandler(false, "")
                }
                
                page.getPropertiesWithCompletionHandler { properties in
                    
                    guard let properties = properties else {

                        return validationHandler(false, "")
                    }
                    
                    validationHandler(properties.url?.path == "/reserve/calendar.php", "")
                }
            }
        }
    }
}

extension SafariExtensionHandler {
    
    func requestAvailabilityOfAllReservations(in window: SFSafariWindow) {
        
        window.getActiveTab { tab in
            
            tab?.getActivePage { page in
                
                page?.dispatchMessageToScript(withName: "request-availability-of-all-reservations", userInfo: nil)
            }
        }
    }
}
