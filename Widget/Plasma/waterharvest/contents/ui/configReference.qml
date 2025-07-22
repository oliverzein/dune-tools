/*
 *  SPDX-FileCopyrightText: 2015 Bernhard Friedrich <friesoft@gmail.com>
 *
 *  SPDX-License-Identifier: GPL-2.0-or-later
 */

import QtQuick 2.5
import QtQuick.Controls 2.5 as QQC2
import QtQuick.Layouts 1.0

import org.kde.kirigami 2.5 as Kirigami
import org.kde.kcmutils as KCM

KCM.SimpleKCM {
    property alias cfg_refTime: refTime.text
    property alias cfg_enableNotifications: enableNotifications.checked
    property alias cfg_notificationTime: notificationTime.value

    Kirigami.FormLayout {
        RowLayout {
            Layout.fillWidth: true

            Kirigami.FormData.label: "Reference Time"

            QQC2.TextField {
                id: refTime
                Layout.fillWidth: true
            }
        }        
        RowLayout {
            Layout.fillWidth: true

            Kirigami.FormData.label: "Enable Notifications"

            QQC2.CheckBox {
                id: enableNotifications
                Layout.fillWidth: true
            }
        }
        RowLayout {
            Layout.fillWidth: true

            Kirigami.FormData.label: "Notification Time"

            QQC2.SpinBox {
                id: notificationTime
                Layout.fillWidth: true
                enabled: enableNotifications.checked
            }
        }
    }
}
