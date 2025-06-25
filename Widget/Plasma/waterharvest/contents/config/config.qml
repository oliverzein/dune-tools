/*
 *  SPDX-FileCopyrightText: 2015 Bernhard Friedreich <friesoft@gmail.com>
 *
 *  SPDX-License-Identifier: GPL-2.0-or-later
 */

import QtQuick 2.2

import org.kde.plasma.configuration 2.0

ConfigModel {
    ConfigCategory {
         name: "Reference Time"
         icon: "chronometer"
         source: "configReference.qml"
    }
}
