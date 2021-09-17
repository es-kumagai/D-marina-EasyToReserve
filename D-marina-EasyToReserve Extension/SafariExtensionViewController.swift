//
//  SafariExtensionViewController.swift
//  D-marina-EasyToReserve Extension
//
//  Created by Tomohiro Kumagai on 2021/09/18.
//

import SafariServices

class SafariExtensionViewController: SFSafariExtensionViewController {
    
    static let shared: SafariExtensionViewController = {
        let shared = SafariExtensionViewController()
        shared.preferredContentSize = NSSize(width:320, height:240)
        return shared
    }()

}
