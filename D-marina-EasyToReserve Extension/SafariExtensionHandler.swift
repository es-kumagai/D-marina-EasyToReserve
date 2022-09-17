//
//  SafariExtensionHandler.swift
//  D-marina-EasyToReserve Extension
//
//  Created by Tomohiro Kumagai on 2021/09/18.
//

import SafariServices
import HolidaysInJapan

final class SafariExtensionHandler: SFSafariExtensionHandler {
    
    let holidaysMessageName = "holidays"
    let jsonEncoder = JSONEncoder()
    
    @MainActor
    var holidays: Holidays = []
    
    @MainActor
    override func messageReceived(withName messageName: String, from page: SFSafariPage, userInfo: [String : Any]?) {

        switch messageName {

        case "prepare-holidays":
            requestHolidays(in: page, needsResponse: false)

        case "request-holidays":
            requestHolidays(in: page, needsResponse: true)
            
        default:
            break;
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
    
    @MainActor
    func requestHolidays(in page: SFSafariPage, needsResponse: Bool) {

        Task {
            
            do {

                if holidays.isEmpty {
                    
                    let today = Holiday.Date()
                    
                    holidays = try await Holidays.getHolidaysInJapanAsync().filter {
                        
                        $0.date >= today
                    }
                }
                
                if needsResponse {

                    let json: String
                    
                    defer {
                        
                        page.dispatchMessageToScript(withName: holidaysMessageName, userInfo: [
                            "holidays" : json
                        ])
                    }
                    
                    do {
                        json = try String(data: jsonEncoder
                            .encode(holidays), encoding: .utf8)!
                    }
                    catch {
                        
                        json = "[]"
                        throw error
                    }
                }
            }
            catch {
                
                NSLog("Failed to get holidays: \(error.localizedDescription)")
            }
        }
    }
    
    func requestAvailabilityOfAllReservations(in window: SFSafariWindow) {
        
        window.getActiveTab { tab in
            
            tab?.getActivePage { page in
                
                page?.dispatchMessageToScript(withName: "request-availability-of-all-reservations", userInfo: nil)
            }
        }
    }
}
